# 📧 Job Application Email Sender

A powerful Node.js application to automatically send professional job application emails to multiple recruiters. Streamline your job search while maintaining a personalized, professional touch.

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## ✨ Features

- ✅ **Batch Sending** - Apply to multiple companies simultaneously
- 🎨 **Professional Templates** - Beautiful HTML and plain-text email formats
- 📎 **Auto-Attach Resume** - Automatically includes your PDF resume
- ⏱️ **Smart Rate Limiting** - Prevents email blocking with intelligent throttling
- 🔍 **Email Validation** - Ensures all recipient addresses are valid
- 📊 **Progress Tracking** - Real-time success/failure reports
- 👀 **Preview Mode** - Review emails before sending
- 🎯 **Simple Configuration** - Easy JSON-based setup

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **Gmail account** (or other SMTP service)
- Your **resume in PDF format**

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/job-application-sender.git
cd job-application-sender
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure email settings**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME="Your Name"
MAX_EMAILS_PER_MINUTE=5
```

### 🔐 Gmail Setup (Important!)

For Gmail users, follow these steps:

1. Enable **2-Step Verification** on your Google account
2. Generate an **App Password**:
   - Visit [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Select **"Mail"** as the app
   - Select your device
   - Click **"Generate"**
   - Copy the 16-character password
3. Use this password as `EMAIL_PASS` in your `.env` file

---

## 📝 Configuration

### 1. Update Personal Information

Edit `index.js` and update the `getApplicantData()` method:

```javascript
getApplicantData() {
  return {
    applicantName: 'Your Full Name',
    phoneNumber: '+91 98765 43210',
    emailAddress: 'your.email@example.com',
    linkedinUrl: 'https://linkedin.com/in/yourprofile',
    githubUrl: 'https://github.com/yourusername'
  };
}
```

### 2. Add Recruiter Emails

Edit `emails.json` with your target recruiters:

```json
[
  "recruiter1@company1.com",
  "recruiter2@company2.com",
  "hr@techstartup.com",
  "careers@softwarecompany.com",
  "hiring@yourdreamjob.com"
]
```

### 3. Add Your Resume

Place your resume in the project root directory:

```
resume.pdf  ← Your resume file here
```

---

## 🎯 Usage

### Start the Application

```bash
npm start
```

Or directly with Node.js:

```bash
node index.js
```

### Interactive Menu

```
📋 MAIN MENU
===========
1. Send applications from emails.json
2. Send to a single email
3. Preview email content
4. Exit
```

#### **Option 1: Batch Send**
Send to all emails in `emails.json`
- Shows total email count
- Requests confirmation
- Sends in rate-limited batches
- Displays detailed results

#### **Option 2: Single Email**
Send to a specific recruiter
- Perfect for testing
- Enter email address manually
- Immediate feedback

#### **Option 3: Preview**
Review your email before sending
- Generates preview files:
  - `email-preview.html` (styled version)
  - `email-preview.txt` (plain text version)

#### **Option 4: Exit**
Close the application

---

## 📧 Email Template Preview

Your professional email includes:

```
Subject: Application for Software Development Opportunities

Dear Hiring Manager,

I hope this email finds you well. My name is [Your Name], and I am 
currently pursuing my B.Tech in Computer Science Engineering (7th semester).

I am writing to express my interest in software development opportunities 
at your organization...

[Professional content with your skills and experience]

Yours sincerely,
[Your Name]
[Phone Number]
[Email Address]
LinkedIn | GitHub
```

**Attachment:** `resume.pdf`

---

## ⚙️ Advanced Features

### Command Line Options

```bash
# Send to all emails (non-interactive)
node index.js --send-all

# Send test email
node index.js --test

# Generate preview only
node index.js --preview
```

### Custom Templates

Modify email templates in:
```
src/templates/jobApplicationTemplate.js
```

Edit the `generateApplicationEmail()` method to customize:
- Subject line
- Email body (HTML/text)
- Signature format

### Rate Limiting

Configurable in `.env`:

```env
MAX_EMAILS_PER_MINUTE=5
```

- Default: 5 emails per minute
- Automatic 60-second delay between batches
- Prevents email service blocking

---

## 🔧 Troubleshooting

### ❌ Email Connection Failed

**Solutions:**
- Verify `.env` credentials are correct
- For Gmail: Use App Password (not regular password)
- Check firewall/antivirus settings
- Test with a different SMTP server

### ❌ Resume Not Attaching

**Solutions:**
- Ensure file is named exactly `resume.pdf`
- Place file in project root directory
- Check file size (keep under 5MB)
- Verify file isn't corrupted

### ❌ Emails Going to Spam

**Best Practices:**
- Use professional subject line
- Include complete contact information
- Don't send too many emails at once
- Consider email "warm-up" period
- Add unsubscribe option for mass emails

### ❌ Invalid Email Addresses

**Check:**
- JSON format in `emails.json`
- Valid email format: `user@domain.com`
- No extra spaces or special characters

---

## 📊 Results & Monitoring

Detailed feedback after sending:

```
📊 SENDING RESULTS
=================
Total emails: 10
✅ Successful: 8
❌ Failed: 2
📈 Success rate: 80.00%

Failed emails:
- invalid@email.com (Invalid format)
- blocked@domain.com (Connection timeout)
```

---

## ⚠️ Important Considerations

### Legal & Ethical Guidelines

- ✅ **Privacy Laws**: Only send to legitimate business contacts
- ✅ **Opt-Out**: Include unsubscribe option for mass emails
- ✅ **Data Protection**: Never share recruiter emails publicly
- ✅ **Compliance**: Follow GDPR and local privacy regulations

### Best Practices

| Do ✅ | Don't ❌ |
|-------|----------|
| Personalize when possible | Send generic spam |
| Test with your own email first | Send untested emails |
| Send during business hours | Send late night/weekends |
| Track responses | Forget to follow up |
| Keep professional tone | Use informal language |

### Security Guidelines

- 🔒 Never commit `.env` to version control
- 🔒 Use environment variables for secrets
- 🔒 Consider dedicated email account
- 🔒 Regularly rotate credentials

---

## 📁 Project Structure

```
job-application-sender/
├── src/
│   ├── services/
│   │   └── emailService.js          # Email sending logic
│   └── templates/
│       └── jobApplicationTemplate.js # Email templates
├── emails.json                       # Recruiter email list
├── resume.pdf                        # Your resume (add this)
├── .env                              # Configuration (create this)
├── .env.example                      # Example configuration
├── index.js                          # Main application
├── package.json                      # Dependencies
└── README.md                         # Documentation
```

---

## 🛠️ Development

### Extending Features

**Ideas for enhancement:**
- 📝 Add company name/position variables
- 📈 Track email open rates
- ⏰ Schedule emails for specific times
- 📊 Analytics dashboard
- 🧪 A/B test different templates

### Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Support

Need help?

- 📖 Check the [Troubleshooting](#-troubleshooting) section
- 💬 Review code comments in source files
- 🐛 [Open an issue](https://github.com/yourusername/job-application-sender/issues)
- 📧 Contact the maintainer

---

## 🎉 Final Tips for Job Success

This tool helps with efficiency, but remember:

- 🎯 **Personalize** applications when possible
- 🔍 **Research** companies before applying
- 📞 **Follow up** professionally after 1-2 weeks
- 💪 **Keep improving** your technical skills
- 🤝 **Network actively** on LinkedIn and at events
- 📈 **Track applications** in a spreadsheet

---

## 🌟 Good Luck with Your Job Search!

**Made with ❤️ for job seekers**

[![Star on GitHub](https://img.shields.io/github/stars/Banti4750/cold-email?style=social)](https://github.com/Banti4750/cold-email)

---

*Remember: Quality applications > Quantity. Use this tool responsibly!*
