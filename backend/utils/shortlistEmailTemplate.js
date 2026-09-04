
const shortlistEmailTemplate = (jobTitle, companyName) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Shortlisted</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 10px;
                padding: 30px;
                box-sizing: border-box;
            ">

                <h2 style="
                    margin-top: 0;
                    color: #222222;
                ">
                    Congratulations!
                </h2>

                <p style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #444444;
                ">
                    We are pleased to inform you that your application for
                    <strong>${jobTitle}</strong> at
                    <strong>${companyName}</strong>
                    has been shortlisted.
                </p>

                <p style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #444444;
                ">
                    Your application has been selected for the next stage
                    of our hiring process.
                </p>

                <p style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #444444;
                ">
                    Our recruitment team will contact you with further
                    details regarding the interview.
                </p>

                <p style="
                    font-size: 16px;
                    line-height: 1.6;
                    color: #444444;
                ">
                    Please keep an eye on your email for further updates.
                </p>

                <p style="
                    margin-top: 30px;
                    font-size: 15px;
                    line-height: 1.5;
                    color: #444444;
                ">
                    Best regards,<br>
                    <strong>${companyName} Recruitment Team</strong>
                </p>

            </div>

        </body>
        </html>
    `;
};

export default shortlistEmailTemplate;

