// require express
const express = require('express');
const app = express();
// import the router
const router = express.Router();

const Group = require('../models/group');
const GroupController = require('../controllers/groupController');

// retrieves the groups that the user is part of
router.get('/', async (req, res) => {
    const { searchterm, number } = req.query;
    if (searchterm) {
        if (number) {
            console.log(`looking for number ${number}`);
        }

        const regex = new RegExp(searchterm, 'i');
        // if is private, the user must be within the list of members.
        Group.find().or([{ name: regex, isPrivate: false }, { name: regex, members: req.user }, { hospitalName: regex, isPrivate: false }, { hospitalName: regex, members: req.user }]).limit(parseInt(number))
        .then(groupsFoundByName => {
            console.log(groupsFoundByName);
            return res.json(groupsFoundByName);
        })
        .catch(error => {
            console.log(error);
            return res.json({ message: `error searching with string ${req.query.searchterm}`});
        });
    } else {
        // req.user is made in the authorization middleware
        return res.json({ groups: req.user.groups });
    }
});

router.post('/', async (req, res) => {
    console.log('a new group is being made');

    await GroupController.createNewGroup(req.body, req.user)
    .then(resObj => {
        res.json(resObj);
    })
    .catch(err => {
        res.status(err.code || 500).json({ errorMessage: err.message });
    })
});

// export the module
module.exports = router;