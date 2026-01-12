require('dotenv').config();

const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  from: process.env.EMAIL_FROM,
  fromName: process.env.EMAIL_FROM_NAME || 'Email Sender',
  maxEmailsPerMinute: parseInt(process.env.MAX_EMAILS_PER_MINUTE) || 10,
};

// Validate required configuration
const requiredFields = ['EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];
requiredFields.forEach(field => {
  if (!process.env[field]) {
    console.error(`❌ Missing required environment variable: ${field}`);
    process.exit(1);
  }
});

module.exports = emailConfig;