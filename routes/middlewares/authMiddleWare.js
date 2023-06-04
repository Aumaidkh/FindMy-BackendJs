const jwt = require('jsonwebtoken');

// Middleware function to validate the JWT token
const authenticateToken = (req, res, next) => {
    
    // Extracting Token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        // Token Not Attached
        return res.status(401)
            .json({ message: 'Authentication token not found'});
    }

    jwt.verify(token,'findmy-secret-key', (err, user) => {
        if(err){
            return res.status(403)
                .json({ message : 'Invalid or expired token'});
        }

        // Set the user object in the request for further processing
        req.user = user;
        next();
    });

};

module.exports = authenticateToken;