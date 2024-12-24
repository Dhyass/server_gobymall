import nodemailer from 'nodemailer';

async function sendEmail(userEmail, message) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASSWORD,
        }
    });

    const mailOptions = {
        from: process.env.AUTH_EMAIL,
        to: userEmail,
        subject: "GOBYMAIL Verification Code",
        html: `
            <html>
                <head>
                    <title>GOBYMALL Email Verification</title>
                </head>
                <body>
                    <h1>GOBYMAIL Verification Code</h1>
                    <p>Your verification code is:</p>
                    <h2 style="color: blue;">${message}</h2>
                    <p>Please enter this code on the verification page to complete your registration process.</p>
                    <p>If you did not request this email, please ignore it.</p>
                </body>
            </html>
        `,
    };
    
    try {
        await transporter.sendMail(mailOptions);
        //console.log(`Verification Email sent to ${userEmail}`);
    } catch (error) {
        throw new Error(`Email sending failed with error: ${error}`);
    }
}

//module.exports = sendEmail;
export default sendEmail; //export default sendEmail; //export default sendEmail; //export default sendEmail
