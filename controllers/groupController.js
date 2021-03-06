const groupModel = require('../models/group');
const Hospital = require('../models/hospital');

class GroupController {
    static createNewGroup(body, user) {
        return new Promise( async (resolve, reject) => {
            const { 
                name, 
                departmentName,
                isOpen,
                hospital, 
                staffingCoordinatorEmail, 
                isPrivate,
                classifications
            } = body;

            // Check that there is no group already with this name within the same hospital.
            const foundGroup = await groupModel.findOne({ name, hospital })
            if (foundGroup) {
                reject({ message: `There is already a group inside hospital ${ hospital } with this name.` });
            }

            const group = new groupModel({
                name,
                hospital,
                departmentName,
                staffingCoordinatorEmail,
                isOpen,
                isPrivate,
                classifications,
                admins: [user],
                members: [user]
            });

            // save the group 
            group.save()
            .then(group => {
                // add the group as an addition to its parent hospital's 'group' array
                Hospital.findByIdAndUpdate(hospital, { $push: { groups: group } }, { runValidators: true }, (err, model) => {
                    if(!err) {
                        resolve(group);
                    } else {
                        console.log(err.message);
                        reject({ message: err.message });
                    }
                });
            })
            .catch(error => {
                reject({ message: error.message });
                return
            });
        });
    }
}

module.exports = GroupController;