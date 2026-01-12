const EmailSenderApp = require('./index');

async function testEmailSending() {
  const app = new EmailSenderApp();
  await app.init();

  // Test with a small array
  const testEmails = [
    'karishmacair47050@gmail.com'
  ];

  const subject = 'Test Email';
  const htmlContent = '<h1>Test Email</h1><p>This is a test email.</p>';

  const result = await app.sendEmailsFromArray(testEmails, subject, htmlContent);
  console.log('Test completed:', result);
}

testEmailSending().catch(console.error);