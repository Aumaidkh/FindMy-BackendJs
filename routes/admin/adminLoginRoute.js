const express = require("express");
const router = express.Router();
const User = require("../../models/user")
const jwt = require("jsonwebtoken");

// EndPoint For Admin Login
router.post('/login',async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email, role:'ADMIN'}});

        // No Admin Found with the credentials
        if(!user){
            // No Admin associated with the email
            return res.status(404).json({message:"No admin associated the sent email found!"});
        }

        // Admin Found but password is incorrect
        if(user.password !==password){
            return res.status(403).json({message:"Incorrect password"})
        }

        // Create a Jwt
        const token = jwt.sign({userId: user.id},"Find-My-Secret",{expiresIn: "1h"});
        res.status(200)
            .json({token:token});
    }catch(error){
        res.status(500)
            .json({message:error})
    }
})

module.exports = router;