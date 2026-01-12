class JobApplicationTemplate {
  /**
   * Generate professional job application email
   * @param {Object} data - Applicant details
   * @returns {Object} - HTML and text versions of the email
   */
  static generateApplicationEmail(data) {
    const {
      applicantName = 'Your Name',
      phoneNumber = '+91 12345 67890',
      emailAddress = 'your.email@example.com',
      linkedinUrl = 'https://linkedin.com/in/yourprofile',
      githubUrl = 'https://github.com/yourusername',
      portfolioUrl="https://your-portfolio.com"
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
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
        }
        .email-container {
            padding: 20px;
        }
        .header {
            margin-bottom: 20px;
        }
        .subject {
            color: #2c3e50;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .content {
            font-size: 14px;
            margin-bottom: 20px;
        }
        .skills {
            margin: 15px 0;
            padding-left: 20px;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .applicant-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .contact-info {
            font-size: 13px;
            color: #555;
            margin: 3px 0;
        }
        .contact-info a {
            color: #0073b1;
            text-decoration: none;
        }
        .bold {
            font-weight: bold;
        }
        .attachment-note {
            padding: 10px;
            margin-top: 15px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="subject">Application for Software Development Opportunities</div>
        </div>

        <div class="content">
            <p>Dear Hiring Manager,</p>

            <p>I hope this email finds you well.</p>

            <p>My name is <span class="bold">${applicantName}</span>, and I am currently pursuing my B.Tech in Computer Science Engineering (8th semester). I am writing to express my interest in <span class="bold">software development opportunities</span> at your organization, and I am open to being considered for <span class="bold">any suitable developer role</span> based on my skills and profile.</p>

            <p>I have a strong foundation in <span class="bold">JavaScript and backend development</span>, with hands-on experience in <span class="bold">Node.js, Express.js, MongoDB, MySQL, and React.js</span>. My technical exposure includes developing <span class="bold">RESTful APIs, implementing authentication mechanisms, database schema design, and writing clean, modular, and maintainable code</span>.</p>

            <p>Additionally, I have working knowledge of <span class="bold">DevOps fundamentals</span>, including <span class="bold">Docker containerization, CI/CD pipelines using GitHub Actions, cloud deployment processes, and version control using Git</span>. I am comfortable working within structured development environments and following established engineering practices.</p>

            <div class="attachment-note">
                <strong> Attachment:</strong> I have attached my resume for your review. I would appreciate the opportunity to discuss how my skills and enthusiasm can align with your organization's requirements.
            </div>

            <p>Thank you for your time and consideration.</p>
        </div>

        <div class="signature">
            <div class="applicant-name">Yours sincerely,</div>
            <div class="applicant-name">${applicantName}</div>
            <div class="contact-info">${phoneNumber}</div>
            <div class="contact-info">${emailAddress}</div>
            <div class="contact-info">
                <a href="${linkedinUrl}">LinkedIn</a> |
                <a href="${githubUrl}">GitHub</a> |
                <a href="${portfolioUrl}">Portfolio</a>
            </div>
        </div>
    </div>
</body>
</html>
    `;

    const textTemplate = `Subject: Application for Software Development Opportunities

Dear Hiring Manager,

I hope this email finds you well.

My name is ${applicantName}, and I am currently pursuing my B.Tech in Computer Science Engineering (8th semester). I am writing to express my interest in software development opportunities at your organization, and I am open to being considered for any suitable developer role based on my skills and profile.

I have a strong foundation in JavaScript and backend development, with hands-on experience in Node.js, Express.js, MongoDB, MySQL, and React.js. My technical exposure includes developing RESTful APIs, implementing authentication mechanisms, database schema design, and writing clean, modular, and maintainable code.

Additionally, I have working knowledge of DevOps fundamentals, including Docker containerization, CI/CD pipelines using GitHub Actions, cloud deployment processes, and version control using Git. I am comfortable working within structured development environments and following established engineering practices.

I have attached my resume for your review. I would appreciate the opportunity to discuss how my skills and enthusiasm can align with your organization's requirements.

Thank you for your time and consideration.

Yours sincerely,
${applicantName}yes

${phoneNumber}
${emailAddress}
LinkedIn: ${linkedinUrl} | GitHub: ${githubUrl} | Portfolio: ${portfolioUrl}`;

    return {
      html: htmlTemplate,
      text: textTemplate,
      subject: `Application for Software Development Opportunities - ${applicantName}`
    };
  }
}

module.exports = JobApplicationTemplate;