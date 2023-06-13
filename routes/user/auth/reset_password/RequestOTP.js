const express = require("express");
const router = express.Router();

const User = require("../../../../models/user");
const OtpModel = require("../../../../models/OtpModel");

// Importing Twilio
const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');

// Importing NodeMailer for sending otp over emails
const nodemailer = require('nodemailer');
// Secrets
require("dotenv").config();

// Create Twilio Client
const client = twilio(process.env.TWILIO_SID,process.env.TWILIO_ACCESS_TOKEN);

// Returns 6 Digit OTP
function generateOtp(){
    return Math.floor(100000 + Math.random() * 900000);
}

// Send OTP using phone number
async function sendOtpToPhoneNumber(phone,otp,countryCode,res){
    try {
        await client.messages.create({
            body:`Your otp is ${otp}`,
            from:process.env.TWILIO_PHONE_NUMBER,
            to:`${countryCode}${phone}`
        }); 
        res.status(200)
            .json({message:"OTP sent successfully via phone"});
    } catch (error) {
        res.status(500)
            .json({message:error});
    }
}


// Send OTP on email
async function sendOtpToEmail(email,otp,res){
    // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.OTP_EMAIL,
      pass: process.env.OTP_EMAIL_PASSWORD
    }
  });

  const subject = 'One Time Password (OTP)';
  const body = `Your One Time password is ${otp}`;
  
  const mailOptions = {
    from: process.env.OTP_EMAIL,
    to: email,
    subject: subject,
    text: body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200)
        .json({message:"OTP sent successfully via email"})
  } catch (error) {
    res.status(500)
        .json({message:error});
  }
}

router.post("/send-otp",async (req, res) => {
    
    // Get Hold Of Email
    const { email } = req.body;

    try {
        
        // Get Hold of user
        const user = await User.findOne({
            where: { email: email}
        });

        // User not found associated with this email
        if(!user){
            return res.status(404)
                        .json({message:"No user found associated with this email"});
        }

        // Create an otp and save it
        const otp = generateOtp();

        // Find the existing OTP record for the email
        const [numRowsUpdated, updatedOtp] = await OtpModel.update(
            { otp: otp },
            { where: { email: user.email } }
          );
        
          // Check if any existing OTP record was updated
          if (numRowsUpdated > 0) {
            console.log('OTP updated successfully.');
          } else {
            // If no existing OTP record was updated, create a new record
            await OtpModel.create({
              email: user.email,
              otp: otp
            });
          }
        // If user has a phone number associated with his account
        // Send an otp to it other wise send an otp via email
        if(user.phone){
            sendOtpToPhoneNumber(
                user.phone,
                otp,
                "+91",
                res
            )
        } else {
            sendOtpToEmail(
                user.email,
                otp,
                res
            )
        }

    } catch (error) {
        res.status(500)
            .json({ message: error})
    }

});

module.exports = router;