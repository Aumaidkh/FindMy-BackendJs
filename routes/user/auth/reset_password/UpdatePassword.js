const express = require("express");
const router = express.Router();

const tokens = require("../../../../models/TokenModel");
const otps = require("../../../../models/OtpModel");
const users = require("../../../../models/user");

//###################################### Update Password #######################################
// Updates the password for a user by doing the following
// Gets hold of the resetToken and verifies it by checking if the token is stored there
// in database when the token is there the validity of the token too is checked, if the token
// is valid then password is updated for the user and after updating the password the token is deleted


async function isPasswordTokenVerified(email,token){
    // Get hold of row entry
    const passwordTokenEntry = await tokens.findOne({
        where:{
            email: email
        }
    });

    // Token is not there in database
    if(!passwordTokenEntry){
        return false;
    }

    // if token is not expired validate the passwordEntry token
    if(passwordTokenEntry.expires_at > new Date().getTime()){
        return passwordTokenEntry.token.toString() === token.toString();
    }

    return false;
}

async function passwordUpdated(email,password){
   // Update Password For the User
    try {
        await users.update(
          { password: password },
          { where: { email: email } }
        );
        return true;
      } catch (error) {
        return false;
      }

};

async function deleteOtpEntry(email){
    // Delete OTP
    await otps.destroy({
        where:{
            email: email
        }
    });
}

async function deletePasswordTokenEntry(email){
    // Delete Password Token Entry
    await tokens.destroy({
        where:{
            email: email
        }
    });
}

router.post('/update-password',async (req, res )=>{
    // Get Hold of request params 
    const { email, password, password_reset_token} = req.body;

    if(await !isPasswordTokenVerified(email,password_reset_token)){
        return res.status(403)
            .json({message:"Invalid token"})
    }

    if(await !passwordUpdated(email,password)){
        return res.status(500)
            .json({message:"Error updating password"})
    }


    await deleteOtpEntry(email);

    await deletePasswordTokenEntry(email);

    return res.status(201)
        .json({message:"Password Updated"})
});


module.exports = router;