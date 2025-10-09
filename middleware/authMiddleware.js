const jwt = require("jsonwebtoken"); 
const User = require("../models/userModel");

const checkUserAuth = async (req, resp,next) => {
    // let token;
    try {
        //getting authorization from req headers
        const { authorization } = req.headers;

        //checking if token is present in headers with formate
        if (!(authorization && authorization.startsWith('Bearer'))) {
            return resp.status(401).json({
                status: "failed",
                message: "Unauthorized User, No Token"
            });
        }
        //extracting token from headers
        const token = authorization.split(' ')[1]

        //verifying token using secret key
        const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY)

        //finding user from database using userId
        req.user = await User.findById(userId).select(-"password")

        //if user is found then call next function
        next();
    } catch (err) {
        //if token is invalid or expired then send 401 status code
        // console.log(Error)
        resp.status(401).json({
            status: "failed",
            message: "Authentication failed" // Provide a specific error message
          });
    }

};

module.exports = checkUserAuth;