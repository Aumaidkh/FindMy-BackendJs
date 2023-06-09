// app.js
const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/user');
const sequelize = require('./config/database');

require('dotenv').config();

const loginRoutes = require("./routes/user/auth/login");
const adminRoutes = require("./routes/admin/adminLoginRoute");
const userRoutes = require("./routes/user/userRoute");
const registerRoute = require('./routes/user/auth/register');

const userAuthRoutes = require('./routes/user/auth/userAuthRoutes');
const signInWithGoogleRoute = require('./routes/user/auth/SignInWithGoogle');

const app = express();
app.use(bodyParser.json());

// Mount the login route
app.use('/api/v1/login',loginRoutes);

app.use('/api/v1/google-sign-in',signInWithGoogleRoute);

// Mount the register route
app.use('/api/v1/register',registerRoute);

// Admin Routes
app.use('/api/v1/admin',adminRoutes);

// User Routes
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/user',userAuthRoutes);

sequelize.sync()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });