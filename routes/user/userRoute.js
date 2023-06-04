const express = require('express');
const User = require('../../models/user');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleWare');

router
    .get("/",authMiddleware,async (req, res) => {
        try{
            const userId = req.user.userId;
            const user = await User.findByPk(userId);

            if(!user){
                return res.status(401)
                    .json({ message : 'User not found'});
            }

            return res.status(200)
                        .json({ user });
        } catch(error) {
            res.status(500)
                .json({ message: 'Error retrieving user details', error: error.message});
        }
    });


module.exports = router;