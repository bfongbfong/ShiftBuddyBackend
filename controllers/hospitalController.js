const hospitalModel = require('../models/hospital');
const mongoose = require('mongoose');

class HospitalController {
    static createNewHospital(body) {
        return new Promise((resolve, reject) => {
            const { name, location, groups } = body;
            const hospital = new hospitalModel({
                name,
                location,
                groups
            });

            hospital.save()
            .then(savedHospital => {
                resolve(savedHospital);
            })
            .catch(err => {
                reject({ message: err.message });
                return
            });
        });
    }
}

module.exports = HospitalController;