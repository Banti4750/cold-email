const nodemailer = require('nodemailer');
const emailConfig = require('../config/emailConfig');
const EmailValidator = require('../utils/emailValidator');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: emailConfig.host,
      port: emailConfig.port,
      secure: emailConfig.secure,
      service: emailConfig.service,
      auth: emailConfig.auth,
      tls: {
        rejectUnauthorized: false
      }
    });

    this.emailQueue = [];
    this.isProcessing = false;
    this.maxEmailsPerMinute = emailConfig.maxEmailsPerMinute;
  }

  // Test email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to email server:', error.message);
      return false;
    }
  }

  // Send a single email
  async sendSingleEmail(to, subject, htmlContent, textContent = '') {
    try {
      const mailOptions = {
        from: `"${emailConfig.fromName}" <${emailConfig.from}>`,
        to,
        subject,
        html: htmlContent,
        text: textContent || this.extractTextFromHTML(htmlContent),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent to ${to}: ${info.messageId}`);

      return {
        success: true,
        email: to,
        messageId: info.messageId,
        response: info.response
      };
    } catch (error) {
      console.error(`❌ Failed to send email to ${to}:`, error.message);

      return {
        success: false,
        email: to,
        error: error.message
      };
    }
  }

  // Send to multiple emails with rate limiting
  async sendBulkEmails(emails, subject, htmlContent, textContent = '', batchSize = null) {
    // Validate email array
    const validation = EmailValidator.validateEmailArray(emails);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        invalidEmails: validation.invalidEmails || []
      };
    }

    const validEmails = validation.emails;
    const results = [];
    const batch = batchSize || this.maxEmailsPerMinute;

    console.log(`📧 Starting to send ${validEmails.length} emails...`);

    for (let i = 0; i < validEmails.length; i += batch) {
      const batchEmails = validEmails.slice(i, i + batch);
      const batchPromises = batchEmails.map(email =>
        this.sendSingleEmail(email, subject, htmlContent, textContent)
      );

      try {
        const batchResults = await Promise.allSettled(batchPromises);

        batchResults.forEach((result, index) => {
          const email = batchEmails[index];
          if (result.status === 'fulfilled') {
            results.push(result.value);
          } else {
            results.push({
              success: false,
              email,
              error: result.reason.message
            });
          }
        });

        console.log(`✅ Batch ${Math.floor(i/batch) + 1} completed: ${i + batchEmails.length}/${validEmails.length}`);

        // Rate limiting: wait 60 seconds before next batch (except last batch)
        if (i + batch < validEmails.length) {
          console.log(`⏳ Waiting 60 seconds before next batch...`);
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
      } catch (error) {
        console.error(`❌ Batch ${Math.floor(i/batch) + 1} failed:`, error.message);
      }
    }

    // Calculate statistics
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return {
      success: true,
      total: validEmails.length,
      sent: successful,
      failed,
      results,
      summary: {
        successRate: ((successful / validEmails.length) * 100).toFixed(2) + '%',
        failureRate: ((failed / validEmails.length) * 100).toFixed(2) + '%'
      }
    };
  }

  // Helper method to extract text from HTML
  extractTextFromHTML(html) {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Send email with template
  async sendTemplateEmail(to, subject, templateName, data) {
    const templates = {
      welcome: `
        <h1>Welcome, ${data.name}!</h1>
        <p>Thank you for joining our service.</p>
        <p>Your account has been created successfully.</p>
      `,
      newsletter: `
        <h1>${data.title || 'Newsletter'}</h1>
        <p>${data.content || 'Latest updates from our service'}</p>
        ${data.link ? `<a href="${data.link}">Learn More</a>` : ''}
      `,
      notification: `
        <h2>Notification</h2>
        <p>${data.message}</p>
        <p><small>This is an automated message.</small></p>
      `
    };

    const htmlContent = templates[templateName] || templates.notification;
    return this.sendSingleEmail(to, subject, htmlContent);
  }
}

module.exports = EmailService;