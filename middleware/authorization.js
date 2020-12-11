const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

module.exports = {
    async auth(req, res, next) {
        try {
            const decodedToken = jwt.verify(req.headers.authorization, process.env.SECRET_TOKEN);

            userModel.findOne({ _id: decodedToken.userId }, (err, user) => {
                if (err) {
                    return res.status(500).json({ message: "Internal Error, Database" });
                } else if (!user) {
                    return res.status(401).json({ message: "User not found, token issue."});
                } else {
                    req.user = user;
                    next();
                }
            })
        } catch (err) {
            // jwt.verify throws an error if bad token
            return res.status(401).json({ message: "Please login again, invalid token."});
        }
    }
}