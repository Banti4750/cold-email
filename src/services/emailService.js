const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const JobApplicationTemplate = require('../templates/jobApplicationTemplate');

class SimpleEmailService {
  constructor() {
    // Load email configuration from environment variables
    this.emailConfig = {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      from: process.env.EMAIL_FROM,
      fromName: process.env.EMAIL_FROM_NAME || 'Job Applicant',
    };

    // Validate required configuration
    if (!this.emailConfig.auth.user || !this.emailConfig.auth.pass) {
      console.error('❌ Please set EMAIL_USER and EMAIL_PASS in .env file');
      process.exit(1);
    }

    this.transporter = nodemailer.createTransport({
      host: this.emailConfig.host,
      port: this.emailConfig.port,
      secure: this.emailConfig.secure,
      auth: this.emailConfig.auth,
    });

    this.resumePath = path.join(__dirname, '../../resume.pdf');
    this.maxEmailsPerMinute = parseInt(process.env.MAX_EMAILS_PER_MINUTE) || 5;
  }

  // Test email configuration
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email server connection verified successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to connect to email server:', error.message);
      console.log('💡 For Gmail, make sure to:');
      console.log('   1. Enable 2-Step Verification');
      console.log('   2. Generate an App Password');
      console.log('   3. Use the App Password in EMAIL_PASS');
      return false;
    }
  }

  // Check if resume file exists
  async checkResumeAttachment() {
    try {
      await fs.access(this.resumePath);
      const stats = await fs.stat(this.resumePath);
      console.log(`✅ Resume file found: ${path.basename(this.resumePath)} (${(stats.size / 1024).toFixed(2)} KB)`);
      return true;
    } catch (error) {
      console.warn(`⚠️ Resume file not found: ${this.resumePath}`);
      console.log('📝 Emails will be sent without attachment');
      return false;
    }
  }

  // Send job application to a single email
  async sendApplication(toEmail, applicantData) {
    try {
      // Generate email content
      const emailContent = JobApplicationTemplate.generateApplicationEmail(applicantData);

      const mailOptions = {
        from: `"${applicantData.applicantName}" <${this.emailConfig.from}>`,
        to: toEmail,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        attachments: []
      };

      // Add resume attachment if available
      const hasResume = await this.checkResumeAttachment();
      if (hasResume) {
        mailOptions.attachments.push({
          filename: `${applicantData.applicantName.replace(/\s+/g, '_')}_Resume.pdf`,
          path: this.resumePath,
          contentType: 'application/pdf'
        });
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Application sent to: ${toEmail}`);

      return {
        success: true,
        email: toEmail,
        messageId: info.messageId,
        hasAttachment: hasResume
      };
    } catch (error) {
      console.error(`❌ Failed to send to ${toEmail}:`, error.message);

      return {
        success: false,
        email: toEmail,
        error: error.message
      };
    }
  }

  // Send applications to multiple emails
  async sendBulkApplications(emailList, applicantData) {
    // Validate email list
    if (!Array.isArray(emailList) || emailList.length === 0) {
      return {
        success: false,
        error: 'Email list must be a non-empty array'
      };
    }

    // Validate email format and remove duplicates
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = [...new Set(emailList.filter(email => emailRegex.test(email)))];

    if (validEmails.length === 0) {
      return {
        success: false,
        error: 'No valid email addresses found'
      };
    }

    if (validEmails.length !== emailList.length) {
      console.warn(`⚠️ Filtered out ${emailList.length - validEmails.length} invalid email(s)`);
    }

    console.log(`📨 Starting to send applications to ${validEmails.length} email(s)...`);

    const results = [];
    const batchSize = Math.min(this.maxEmailsPerMinute, 10); // Max 10 emails per batch

    for (let i = 0; i < validEmails.length; i += batchSize) {
      const batchEmails = validEmails.slice(i, i + batchSize);

      console.log(`\n📦 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(validEmails.length/batchSize)}`);

      // Send emails in parallel within batch
      const batchPromises = batchEmails.map(email =>
        this.sendApplication(email, applicantData)
      );

      const batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
        const email = batchEmails[index];
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            email: email,
            error: result.reason.message
          });
        }
      });

      console.log(`✅ Batch completed: ${Math.min(i + batchSize, validEmails.length)}/${validEmails.length}`);

      // Rate limiting between batches
      if (i + batchSize < validEmails.length) {
        console.log(`⏳ Waiting 60 seconds before next batch...`);
        await new Promise(resolve => setTimeout(resolve, 60000));
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

  // Preview email without sending
  async previewEmail(applicantData) {
    const emailContent = JobApplicationTemplate.generateApplicationEmail(applicantData);

    console.log('\n📧 Email Preview:');
    console.log('='.repeat(50));
    console.log(`Subject: ${emailContent.subject}`);
    console.log('='.repeat(50));
    console.log('\nText Version:');
    console.log(emailContent.text);

    // Save preview to file
    try {
      await fs.writeFile('email-preview.html', emailContent.html);
      await fs.writeFile('email-preview.txt', emailContent.text);
      console.log('\n💾 Preview saved to: email-preview.html and email-preview.txt');
    } catch (error) {
      console.error('Could not save preview files:', error.message);
    }

    return emailContent;
  }
}

module.exports = SimpleEmailService;