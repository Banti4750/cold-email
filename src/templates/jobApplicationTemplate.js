class JobApplicationTemplate {
  /**
   * Generate personalized job application email
   * @param {Object} data - Applicant and company details
   * @returns {Object} - HTML and text versions of the email
   */
  static generateApplicationEmail(data) {
    const {
      applicantName = 'Your Name',
      hrName = 'Hiring Manager',
      position = 'Software Developer',
      companyName = 'your organization',
      phoneNumber = '+91 12345 67890',
      emailAddress = 'your.email@example.com',
      linkedinUrl = 'https://linkedin.com/in/yourprofile',
      githubUrl = 'https://github.com/yourusername',
      customNote = ''
    } = data;

    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application for Software Development Opportunities</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
        }
        .header {
            border-bottom: 3px solid #0073b1;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .subject {
            color: #0073b1;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 25px;
        }
        .content {
            font-size: 15px;
            margin-bottom: 20px;
        }
        .highlight {
            background-color: #f0f8ff;
            padding: 12px;
            border-left: 4px solid #0073b1;
            margin: 15px 0;
            font-style: italic;
        }
        .skills-list {
            margin-left: 20px;
            margin-bottom: 20px;
        }
        .skills-list li {
            margin-bottom: 8px;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #eee;
        }
        .applicant-name {
            font-size: 18px;
            font-weight: bold;
            color: #0073b1;
            margin-bottom: 5px;
        }
        .contact-info {
            font-size: 14px;
            color: #555;
            margin: 5px 0;
        }
        .contact-info a {
            color: #0073b1;
            text-decoration: none;
        }
        .contact-info a:hover {
            text-decoration: underline;
        }
        .attachment-note {
            background-color: #fff8e1;
            padding: 10px;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 14px;
            border-left: 3px solid #ffc107;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .email-container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="subject">Application for Software Development Opportunities</div>
            <div class="greeting">Dear ${hrName},</div>
        </div>

        <div class="content">
            <p>I hope this email finds you well.</p>

            <p>My name is <strong>${applicantName}</strong>, and I am currently pursuing my B.Tech in Computer Science Engineering (7th semester). I am writing to express my interest in <strong>software development opportunities</strong> at ${companyName}, and I am open to being considered for <strong>any suitable developer role</strong> based on my skills and profile.</p>

            <div class="highlight">
                I have a strong foundation in <strong>JavaScript and backend development</strong>, with hands-on experience in:
            </div>

            <ul class="skills-list">
                <li><strong>Node.js, Express.js</strong> - Building scalable server-side applications</li>
                <li><strong>MongoDB, MySQL</strong> - Database design, optimization, and management</li>
                <li><strong>React.js</strong> - Creating dynamic and responsive user interfaces</li>
                <li><strong>RESTful APIs</strong> - Designing and implementing robust API architectures</li>
                <li><strong>Authentication & Security</strong> - Implementing secure authentication mechanisms</li>
                <li><strong>Code Quality</strong> - Writing clean, modular, and maintainable code</li>
            </ul>

            <p>Additionally, I have working knowledge of <strong>DevOps fundamentals</strong>, including:</p>

            <ul class="skills-list">
                <li><strong>Docker containerization</strong> for consistent deployment environments</li>
                <li><strong>CI/CD pipelines using GitHub Actions</strong> for automated testing and deployment</li>
                <li><strong>Cloud deployment processes</strong> on platforms like AWS and Heroku</li>
                <li><strong>Version control using Git</strong> with collaborative workflows</li>
            </ul>

            <p>I am comfortable working within structured development environments and following established engineering practices.</p>

            ${customNote ? `<p><strong>Additional Note:</strong> ${customNote}</p>` : ''}

            <div class="attachment-note">
                <strong>📎 Attachment:</strong> I have attached my resume for your detailed review. I would appreciate the opportunity to discuss how my skills and enthusiasm can align with ${companyName}'s requirements.
            </div>
        </div>

        <div class="signature">
            <div class="applicant-name">${applicantName}</div>
            <div class="contact-info">📱 ${phoneNumber}</div>
            <div class="contact-info">✉️ <a href="mailto:${emailAddress}">${emailAddress}</a></div>
            <div class="contact-info">🔗 <a href="${linkedinUrl}">LinkedIn Profile</a> | <a href="${githubUrl}">GitHub Portfolio</a></div>
        </div>

        <div class="footer">
            <p>This email was sent as part of my job application process.</p>
            <p>© ${new Date().getFullYear()} ${applicantName}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;

    const textTemplate = `
Subject: Application for Software Development Opportunities

Dear ${hrName},

I hope this email finds you well.

My name is ${applicantName}, and I am currently pursuing my B.Tech in Computer Science Engineering (7th semester). I am writing to express my interest in software development opportunities at ${companyName}, and I am open to being considered for any suitable developer role based on my skills and profile.

I have a strong foundation in JavaScript and backend development, with hands-on experience in:
- Node.js, Express.js - Building scalable server-side applications
- MongoDB, MySQL - Database design, optimization, and management
- React.js - Creating dynamic and responsive user interfaces
- RESTful APIs - Designing and implementing robust API architectures
- Authentication & Security - Implementing secure authentication mechanisms
- Code Quality - Writing clean, modular, and maintainable code

Additionally, I have working knowledge of DevOps fundamentals, including:
- Docker containerization for consistent deployment environments
- CI/CD pipelines using GitHub Actions for automated testing and deployment
- Cloud deployment processes on platforms like AWS and Heroku
- Version control using Git with collaborative workflows

I am comfortable working within structured development environments and following established engineering practices.

${customNote ? `Additional Note: ${customNote}\n\n` : ''}
I have attached my resume for your detailed review. I would appreciate the opportunity to discuss how my skills and enthusiasm can align with ${companyName}'s requirements.

Thank you for your time and consideration.

Yours sincerely,
${applicantName}
${phoneNumber}
${emailAddress}
LinkedIn: ${linkedinUrl}
GitHub: ${githubUrl}
    `;

    return {
      html: htmlTemplate,
      text: textTemplate,
      subject: `Application for Software Development Opportunities - ${applicantName}`
    };
  }

  /**
   * Generate email for multiple recruiters with company-specific customization
   */
  static generateBulkApplicationData(recruiters, applicantData) {
    return recruiters.map(recruiter => ({
      ...applicantData,
      hrName: recruiter.name || 'Hiring Manager',
      companyName: recruiter.company || 'your organization',
      position: recruiter.position || 'Software Development',
      customNote: recruiter.customNote || ''
    }));
  }
}

module.exports = JobApplicationTemplate;