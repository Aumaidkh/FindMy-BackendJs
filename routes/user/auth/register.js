// loginRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

// Endpoint for register
router.post('/', async (req, res) => {
    try {
      const { fullname, email, password, phone } = req.body;
      const newUser = await User.create({ fullname, email, password,phone });
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
});

module.exports = router;