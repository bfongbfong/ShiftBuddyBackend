const groupModel = require('../models/group');

class GroupController {
    static createNewGroup(body, user) {
        return new Promise((resolve, reject) => {
            const { 
                name, 
                departmentName,
                isOpen,
                groupID, 
                hospitalName, 
                staffingCoordinatorEmail, 
                isPrivate,
                classifications
            } = body;

            const group = new groupModel({
                name,
                groupID,
                hospitalName,
                departmentName,
                staffingCoordinatorEmail,
                isOpen,
                isPrivate,
                classifications,
                admins: [user],
                members: [user],
                memberCount: 1
            });

            group.save()
            .then(group => {
                resolve(group);
            })
            .catch(error => {
                reject({ message: error.message });
                return
            });
        });
    }
}

module.exports = GroupController;