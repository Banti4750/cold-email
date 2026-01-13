#!/usr/bin/env node

const SimpleEmailService = require('./src/services/emailService');
const fs = require('fs').promises;
const readline = require('readline');

class JobApplicationSender {
  constructor() {
    this.emailService = new SimpleEmailService();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // Your personal information (UPDATE THESE)
  getApplicantData() {
    return {
      applicantName: 'Banti Kumar', // ← Change to your name
      phoneNumber: '+91 6203818460', // ← Change to your phone
      emailAddress: 'bantikumar6203818460@gmail.com', // ← Change to your email
      linkedinUrl: 'https://www.linkedin.com/in/banti-kumar-5b1109259/', // ← Change to your LinkedIn
      githubUrl: 'https://github.com/Banti4750' ,
      portfolioUrl: 'https://banti-dev.vercel.app/'// ← Change to your GitHub
    };
  }

  async initialize() {
    console.log('\n🚀 Job Application Email Sender');
    console.log('================================\n');

    // Verify email connection
    const isConnected = await this.emailService.verifyConnection();
    if (!isConnected) {
      console.log('\n❌ Please fix your email configuration and try again.');
      console.log('📁 Check your .env file and make sure EMAIL_USER and EMAIL_PASS are correct.');
      this.rl.close();
      process.exit(1);
    }

    // Check resume
    await this.emailService.checkResumeAttachment();
  }

  async showMainMenu() {
    console.log('\n📋 MAIN MENU');
    console.log('===========');
    console.log('1. Send applications from emails.json');
    console.log('2. Send to a single email');
    console.log('3. Preview email content');
    console.log('4. Exit');

    const choice = await this.question('Choose option (1-4): ');

    switch(choice) {
      case '1':
        await this.sendFromFile();
        break;
      case '2':
        await this.sendSingleEmail();
        break;
      case '3':
        await this.previewEmail();
        break;
      case '4':
        console.log('👋 Goodbye!');
        this.rl.close();
        process.exit(0);
        break;
      default:
        console.log('❌ Invalid choice');
    }

    // Return to menu
    await this.showMainMenu();
  }

  async sendFromFile() {
    try {
      const data = await fs.readFile('./emails.json', 'utf8');
      const emailList = JSON.parse(data);

      if (!Array.isArray(emailList)) {
        throw new Error('emails.json must contain a JSON array');
      }

      console.log(`\n📧 Found ${emailList.length} email(s) in emails.json`);
      console.log('First few emails:', emailList.slice(0, 3).join(', '), emailList.length > 3 ? '...' : '');

      const confirm = await this.question(`\nSend applications to these ${emailList.length} email(s)? (yes/no): `);

      if (confirm.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled');
        return;
      }

      const applicantData = this.getApplicantData();
      const result = await this.emailService.sendBulkApplications(emailList, applicantData);

      this.displayResults(result);

    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      console.log('💡 Make sure emails.json exists and contains a valid JSON array');
    }
  }

  async sendSingleEmail() {
    console.log('\n✉️ Send to Single Email');
    console.log('=====================');

    const email = await this.question('Enter recipient email: ');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format');
      return;
    }

    const confirm = await this.question(`Send application to ${email}? (yes/no): `);

    if (confirm.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled');
      return;
    }

    const applicantData = this.getApplicantData();
    const result = await this.emailService.sendApplication(email, applicantData);

    console.log('\n📊 Result:');
    if (result.success) {
      console.log('✅ Email sent successfully!');
    } else {
      console.log('❌ Failed to send email:', result.error);
    }
  }

  async previewEmail() {
    console.log('\n👁️ Email Preview');
    console.log('===============');

    const applicantData = this.getApplicantData();
    console.log('\nUsing applicant data:');
    console.log(`Name: ${applicantData.applicantName}`);
    console.log(`Email: ${applicantData.emailAddress}`);
    console.log(`Phone: ${applicantData.phoneNumber}`);

    const confirm = await this.question('\nGenerate preview? (yes/no): ');

    if (confirm.toLowerCase() === 'yes') {
      await this.emailService.previewEmail(applicantData);
      console.log('\n✅ Preview generated. Check email-preview.html and email-preview.txt files.');
    }
  }

  displayResults(result) {
    console.log('\n📊 SENDING RESULTS');
    console.log('=================');
    console.log(`Total emails: ${result.total}`);
    console.log(`✅ Successful: ${result.sent}`);
    console.log(`❌ Failed: ${result.failed}`);
    console.log(`📈 Success rate: ${result.summary.successRate}`);

    if (result.failed > 0) {
      console.log('\nFailed emails:');
      result.results
        .filter(r => !r.success)
        .forEach((r, i) => console.log(`${i+1}. ${r.email}: ${r.error}`));
    }

    console.log('\n✅ Process completed!');
  }

  question(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, answer => {
        resolve(answer.trim());
      });
    });
  }

  async start() {
    await this.initialize();

    console.log('\n📝 IMPORTANT: Update your personal information');
    console.log('===========================================');
    console.log('1. Open index.js');
    console.log('2. Find the getApplicantData() method');
    console.log('3. Update with your details:');
    console.log('   - Your name');
    console.log('   - Your phone number');
    console.log('   - Your email');
    console.log('   - Your LinkedIn URL');
    console.log('   - Your GitHub URL');
    console.log('\n4. Add recruiter emails to emails.json');
    console.log('5. Place your resume as resume.pdf in project root\n');

    const ready = await this.question('Have you updated your details? (yes/no): ');

    if (ready.toLowerCase() === 'yes') {
      await this.showMainMenu();
    } else {
      console.log('\n⚠️ Please update your details first.');
      console.log('💡 Open index.js and emails.json to make changes.');
      this.rl.close();
    }
  }
}

// Run the application
async function main() {
  try {
    const app = new JobApplicationSender();
    await app.start();
  } catch (error) {
    console.error('❌ Application error:', error);
    process.exit(1);
  }
}

// Start the application
main();