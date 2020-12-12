const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

class UserController {
    static register(body) {
        return new Promise((resolve, reject) => {
            const user = new userModel({
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                classification: body.classification,
                password: body.password, // UserModel pre-save function encrypts
            })

            user.save()
            .then(user => {
                const token = jwt.sign({
                    usedId: user._id,
                    email: user.email,
                    creationTime: new Date(Date.now())
                }, process.env.SECRET_TOKEN, { expiresIn: '90d'});

                let returnObj = {
                    token: token,
                    user: user
                }

                resolve(returnObj);
            })
            .catch(err => {
                reject({ message: err.message });
                return false;
            })
        });
    }

    static login(body) {
        return new Promise((resolve, reject) => {

        });
    }
}

module.exports = UserController;