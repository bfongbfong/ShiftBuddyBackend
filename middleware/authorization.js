const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

module.exports = {
    async auth(req, res, next) {
        try {
            // console.log(process.env.SECRET_TOKEN);
            const token = req.headers.authorization.split(' ')[1];
            const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
            // console.log(decodedToken);

            userModel.findOne({ _id: decodedToken.userId }, (err, user) => {
                console.log('user finding done');
                console.log(err);
                console.log(user);
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
            console.log(err);
            return res.status(401).json({ message: "Please login again, invalid token."});
        }
    }
}