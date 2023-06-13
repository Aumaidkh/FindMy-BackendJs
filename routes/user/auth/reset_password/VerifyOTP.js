const express = require("express");
const router = express.Router();

const tokens = require("../../../../models/TokenModel");
const otps = require("../../../../models/OtpModel");

// Generates a 32 chars long password request token, this token is then to be validated
// and password is to be updated with this token.
function generatePasswordResetToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars.charAt(randomIndex);
    }

    return result;
}

// Checks if otp matches the one stored in the otp table and is not expired
async function otpVerified(otp,email){

    // Get Hold of Otp Row
    const otpEntry = await otps.findOne({
        where: {
            email: email
        }
    });

    // Check if otp is not expired
    if(otpEntry.expires_at > new Date().getTime()){
        // OTP is expired
        return otp.toString() === otpEntry.otp.toString();
    }

    return false;
}

router.post("/verify-otp",async (req, res) => {
    // Get Hold User Email
    const { email, otp } = req.body;
    // Get Hold of otp for the email
    // Verify the otp for that email
    // if otp is same create a password reset token and is valid and send it as a response
    if(await otpVerified(otp,email)){
        // Generate Token
        const token = generatePasswordResetToken(email);
        console.log("Token: ",token);
        // Save the token to tokens table
        try {
            await tokens.create({
                email: email,
                password_reset_token: token
            });
            return res.status(201)
                .json({message:"OTP Verified",token:token})
        } catch (error) {
            return res.status(500)
                .json({ message: error})
        }
    }
    // if otp is expired or does not match, send invalid otp
    return res.status(403)
        .json({message:"Invalid OTP"});
});


module.exports = router;