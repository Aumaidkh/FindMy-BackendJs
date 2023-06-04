const bodyParser = require('body-parser');
const express = require('express');
const router = express.Router();
const authMiddleWare = require('../../middlewares/authMiddleWare');

const twilio = require('twilio');
const { v4: uuidv4 } = require('uuid');
const User = require('../../../models/user');

// Create Twilio Client
const client = twilio("AC78954a631c9904b351ad9ae0343bb8ce","299e4235b553a8f6b54beb991f6f8d70");

// Create an empty object to store the OTPs
const otps = {};

// Generate a 6 digit random OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

// Update Password
router.post('/update-password/send-otp',authMiddleWare, async (req, res) => {
    try{
         // Get Users phone number from database
         const userId = req.user.userId;

        // Generate an otp
        const otp = generateOtp();

        // Save otp with userId key
        otps[userId] = otp;

        // Find user with this user id
        const user = await User.findByPk(userId);

        if(!user){
            return res.status(404)
                .json({message:"User not found"})
        }


        const phoneNumber = user.phone;
        if(!phoneNumber){
            return res.status(403)
                .json({message:"No phone number added to the user account."})
        }

        await client.messages.create(
            {
                body:`Your otp is ${otp}`,
                from: '+13158471359',
                to:phoneNumber
            }
        );

        res.status(200)
            .json({message:"OTP sent successfully"});
    } catch(error){
        res.status(500).json({message: error})
    }
});

// Update Password Verify Otp
router.post('/update-password/verify-otp',authMiddleWare, async (req, res) => {
    try{
        const { otp, new_password} = req.body;

        const userId = req.user.userId;

        // Retrieve the otp for the userId;
        const savedOtp = otps[userId];
        
        console.log("Saved OTP",savedOtp);
        console.log("OTP",otp);
        // Verify otp
        if(!savedOtp && (savedOtp !== otp)){
            return res.status(401)
            .json( { message: "Invalid OTP "})
        };

        // Update the user password into database
        await User.update({password: new_password},{
            where: {
                id: userId,
            }
        })
            .then((result) => {
                // Delete the otp from saved OTPs.
                delete otps[userId];

                return res.status(200)
                    .json({ message: "Password updated successfully"})
            })
            .catch((error)=>{
                return res.status(500)
                    .json({message:"Error updating password"})
            });

        
    } catch(error){
        res.status(500)
            .json({message:error.message})
    }
});

// Add Phone Number 
router.post('/add-phone-number/request-otp',authMiddleWare, async (req, res) => {
    try{
       // Get Users phone number from database
       const userId = req.user.userId;

       // Generate an otp
       const otp = generateOtp();

       // Save otp with userId key
       otps[userId] = otp;

       // Find user with this user id
       const user = await User.findByPk(userId);

       if(!user){
           return res.status(404)
               .json({message:"User not found"})
       }


       const phoneNumber = user.phone;
       if(!phoneNumber){
           return res.status(403)
               .json({message:"No phone number added to the user account."})
       }

       await client.messages.create(
           {
               body:`Your otp is ${otp}`,
               from: '+13158471359',
               to:phoneNumber
           }
       );

       res.status(200)
           .json({message:"OTP sent successfully"});

    } catch(error){
        res.status(500)
            .json({ message: error.message})
    }
});

// Verify Phone Number
router.post('/add-phone-number/verify-otp',authMiddleWare, async (req, res) => {
    try{
        const { otp, phone} = req.body;

        const userId = req.user.userId;

        // Retrieve the otp for the userId;
        const savedOtp = otps[userId];
        
    
        // Verify otp
        if(!savedOtp && (savedOtp !== otp)){
            return res.status(401)
            .json( { message: "Invalid OTP "})
        };

        // Update the user password into database
        await User.update({phone: phone},{
            where: {
                id: userId,
            }
        })
            .then((result) => {
                // Delete the otp from saved OTPs.
                delete otps[userId];

                return res.status(200)
                    .json({ message: "Phone Number updated successfully"})
            })
            .catch((error)=>{
                return res.status(500)
                    .json({message:"Error updating password"})
            });

        
    } catch(error){
        res.status(500)
            .json({message:error.message})
    }
});


module.exports = router;