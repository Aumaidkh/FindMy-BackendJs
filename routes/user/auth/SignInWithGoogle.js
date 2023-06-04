const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
require('dotenv').config();

const { OAuth2Client } = require('google-auth-library');

router.post("/", (req, res) => {
    // Retrieve the auth token
    const { authToken } = req.body;
    // Verify the Google ID Token and extract user information
    const client = new OAuth2Client(process.env.WEB_CLIENT_ID);

    async function verify(){
        try{
            const ticket = await client.verifyIdToken({
                idToken: authToken,
                requiredAudience :process.env.FRONT_END_CLIENT_ID
            });
    
            const payload = ticket.getPayload();
    
            // Extract the relevant information from the payload
            const { email, given_name } = payload;
            try {
                const newUser = await User.create({
                    fullname:given_name,
                    email:email,
                    login_type:"GOOGLE"
                });
                res.status(201).json({ message: 'User registered successfully', user: newUser });
              } catch (error) {
                switch(error.name){
                    case "SequelizeValidationError":
                        const validationErrors = error.errors.map((err) => ({
                            field: err.path,
                            message: err.message
                        }))
                        res.status(400).json({message:"Error registering user",errors: validationErrors})
                        break;
                    case "SequelizeUniqueConstraintError":
                        const uniqueErrors = error.errors.map((err) =>({
                            field: err.path,
                            message: err.message
                        }))
                        res.status(400).json({ message: 'Error registering user', errors: uniqueErrors });
                        break;
                    default:
                        res.status(500).json({ message: 'Error registering user', error: error.message });    
                }
                
              }

            // Create and Save user to database
            
    
            
        } catch(error){
            console.error("Error verifying Google Id Token:",error);
            res.status(401).json({message:"Invalid Token"})
        }
    }

    verify()
});

module.exports = router;