const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

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
        return new Promise( async (resolve, reject) => {
            const { email, password } = body;
            await userModel.findOne({ email }, async (err, user) => {
                if (err) {
                    reject({ message: err.message });
                    return false;
                }

                if (!user) {
                    reject({ message: 'User with that email not found.', code: 404 });
                    return false;
                }

                const isMatch = await user.comparePassword(password);
                if (!isMatch) {
                    reject({ message: 'Incorrect password', code: 400 });
                    return false;
                }

                // make a token
                const token = jwt.sign({
                    userId: user._id,
                    email: email,
                    creationTime: new Date(Date.now())
                }, process.env.SECRET_TOKEN, { expiresIn: '90d'});

                let returnObj = {
                    token: token,
                    user: user
                };

                console.log(returnObj);

                resolve(returnObj);
            });
        });
    }
}

module.exports = UserController;