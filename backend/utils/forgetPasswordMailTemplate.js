const forgetPasswordMailTemplate = (resetUrl) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Password Reset</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="600" cellpadding="0" cellspacing="0"
                    style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="margin: 0; color: #d63002;">RI Medicare</h2>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h1 style="font-size: 24px; color: #333;">Password Reset Request</h1>
                            <p style="font-size: 16px; color: #555;">
                                You requested a password reset. Please click the link below to reset your password:
                            </p>
                            <p style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" style="
                    display: inline-block;
                    background-color: rgb(214,105,2);
                    color: white;
                    padding: 12px 24px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 16px;
                  ">Reset Password</a>
                            </p>
                            <p style="font-size: 14px; color: #777;">
                                This link will expire in 10 minutes.
                            </p>
                            <p style="font-size: 14px; color: #777;">
                                If you didn’t request this, you can safely ignore this email.
                            </p>
                            <p style="font-size: 14px; color: #777; margin-top: 40px;">
                                Regards,<br>
                                <strong>RI Medicare Support Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
`;

module.exports = forgetPasswordMailTemplate;
