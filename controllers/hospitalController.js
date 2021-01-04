const hospitalModel = require('../models/hospital');
const mongoose = require('mongoose');
const User = require('../models/user');

class HospitalController {
    static createNewHospital(body, user) {
        return new Promise( async (resolve, reject) => {
            const { name, locationString, latitude, longitude, groups } = body;

            // check if another hospital with this name exists
            // const foundHospital = await hospitalModel.findOne({ name })
            // if (foundHospital) {
            //     reject({ message: 'There is already a hospital with this name.' });
            // }

            const hospital = new hospitalModel({
                name,
                locationString,
                latitude,
                longitude,
                groups,
                admins: [user],
                members: [user]
            });

            try {
                const foundHospital = await hospital.save();
                const foundUser = await User.findByIdAndUpdate(user, { $push: { hospitalsWithAdminStatus: foundHospital } });
                console.log(foundUser);
                resolve(hospital);
            } catch(err) {
                reject({ message: err.message });
                return 
            }
        });
    }
}

module.exports = HospitalController;