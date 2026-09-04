import React from 'react'

const interviewEmailTemplate = (jobtitle,interviewDate,interviewLink,mode,interviewTime) => {
  return (
    <div>
        `Subject: Interview Invitation – ${jobtitle}

Hi Rahul,

We are pleased to inform you that you have been shortlisted
for an interview for the ${jobtitle} role.

📅 Date: ${interviewDate}  
⏰ Time: {interviewTime}  
📍 Mode: ${mode}  
🔗 Link: ${interviewLink}

Best regards,  
Hiring Team`

      
    </div>
  )
}

export default interviewEmailTemplate
