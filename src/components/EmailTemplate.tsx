import * as React from 'react';

interface EmailTemplateProps {
  fname: string;
  lname: string;
  email: string;
  subject: string;
  message: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  fname,
  lname,
  email,
  subject,
  message,
}) => (
  <div style={{ fontFamily: "sans-serif", padding: "20px", color: "#333", lineHeight: "1.5" }}>
    <h2 style={{ borderBottom: "1px solid #eee", paddingBottom: "10px" }}>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {fname} {lname}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Subject:</strong> {subject}</p>
    <div style={{ marginTop: "20px" }}>
      <strong>Message:</strong>
      <p style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "5px", whiteSpace: "pre-wrap" }}>
        {message}
      </p>
    </div>
  </div>
);
