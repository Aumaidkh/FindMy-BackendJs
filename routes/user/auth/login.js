// loginRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const jwt = require("jsonwebtoken");

// Endpoint for user login
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ where: { email }});

    if( !user){
      // email/user not found
      return res.status(404).json({message:"No user found associated with this email"})
    }
    
    if( password !== user.password) {
      // Email/User found but password is not correct
      return res.status(403).json({message:"Incorrect password"});
    }

    // Create a Json Web Token
    const token = jwt.sign({ userId: user.id },"findmy-secret-key", { expiresIn: '1h'});
    return res.status(200).json({ 
      message: 'User logged in successfully' ,
      id:user.id,
      email:user.email,
      name:user.fullname,
      token: token});
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

module.exports = router;