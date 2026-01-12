require('dotenv').config();
const EmailService = require('./src/services/emailService');
const fs = require('fs').promises;
const path = require('path');

class EmailSenderApp {
  constructor() {
    this.emailService = new EmailService();
  }

  async init() {
    console.log('📧 Email Sender Application');
    console.log('===========================\n');

    // Verify email connection
    const isConnected = await this.emailService.verifyConnection();
    if (!isConnected) {
      console.log('❌ Exiting application due to connection issues');
      process.exit(1);
    }
  }

  async sendEmailsFromArray(emailArray, subject, htmlContent, textContent = '') {
    console.log('\n🚀 Sending emails from provided array...');

    const result = await this.emailService.sendBulkEmails(
      emailArray,
      subject,
      htmlContent,
      textContent
    );

    this.displayResults(result);
    return result;
  }

  async sendEmailsFromFile(filePath, subject, htmlContent, textContent = '') {
    console.log(`\n📄 Reading emails from file: ${filePath}`);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      const emailArray = JSON.parse(data);

      if (!Array.isArray(emailArray)) {
        throw new Error('File must contain a JSON array of emails');
      }

      return await this.sendEmailsFromArray(emailArray, subject, htmlContent, textContent);
    } catch (error) {
      console.error(`❌ Error reading file: ${error.message}`);
      return null;
    }
  }

  async sendTemplateEmails(emailArray, subject, templateName, templateData) {
    console.log(`\n🎨 Sending template emails (${templateName})...`);

    const results = [];
    for (const email of emailArray) {
      const result = await this.emailService.sendTemplateEmail(
        email,
        subject,
        templateName,
        templateData
      );
      results.push(result);

      // Small delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    this.displayTemplateResults(results);
    return results;
  }

  displayResults(result) {
    console.log('\n📊 Email Sending Results');
    console.log('=======================');
    console.log(`Total emails: ${result.total}`);
    console.log(`Successfully sent: ${result.sent}`);
    console.log(`Failed: ${result.failed}`);
    console.log(`Success rate: ${result.summary.successRate}`);
    console.log(`Failure rate: ${result.summary.failureRate}`);

    if (result.failed > 0) {
      console.log('\n❌ Failed emails:');
      result.results
        .filter(r => !r.success)
        .forEach(r => console.log(`  - ${r.email}: ${r.error}`));
    }
  }

  displayTemplateResults(results) {
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('\n📊 Template Email Results');
    console.log('========================');
    console.log(`Total: ${results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);
  }
}

// Example usage
async function main() {
  const app = new EmailSenderApp();
  await app.init();

  // Example 1: Send emails from an array
//   const emailArray = [
//     'user1@example.com',
//     'user2@example.com',
//     'user3@example.com'
//   ];

  const subject = 'Hello from Node.js Email Sender!';
  const htmlContent = `
    <h1>Hello there! 👋</h1>
    <p>This is a test email sent from our Node.js email sender application.</p>
    <p>Feel free to customize this message!</p>
    <hr>
    <p><small>This is an automated message. Please do not reply.</small></p>
  `;

//   // Send bulk emails
//   await app.sendEmailsFromArray(emailArray, subject, htmlContent);

  // Example 2: Send emails from a JSON file
  await app.sendEmailsFromFile('./emails.json', subject, htmlContent);

  // Example 3: Send template emails
  // const templateData = { name: 'John Doe' };
  // await app.sendTemplateEmails(emailArray, 'Welcome!', 'welcome', templateData);
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

// Export for use in other files
module.exports = EmailSenderApp;