export const sendEmail = async ({ to, subject, html }) => {
  const response = await fetch(
    "https://api.elasticemail.com/v4/emails/transactional",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ElasticEmail-ApiKey": process.env.ELASTIC_EMAIL_API_KEY,
      },
      body: JSON.stringify({
        Recipients: {
          To: [to],
        },
        Content: {
          Body: [
            {
              ContentType: "HTML",
              Content: html,
            },
          ],
          From: process.env.EMAIL_FROM,
          Subject: subject,
        },
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.Error || data?.message || "Email sending failed"
    );
  }

  return data;
};