export const rejectEmailTemplate = ( jobTitle) => {
  return `
    <div style="font-family: Arial, sans-serif;">
      <h2>Application Update</h2>

      <p>Hi,</p>

      <p>
        Thank you for applying for the <b>${jobTitle}</b> position.
      </p>

      <p>
        After careful consideration, we regret to inform you that
        we will not be moving forward with your application at this time.
      </p>

      <p>
        We truly appreciate your interest and encourage you to apply
        for future opportunities.
      </p>

      <br />
      <p>Best regards,</p>
      <p><b>Hiring Team</b></p>
    </div>
  `;
};
