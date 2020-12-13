// require express
const express = require('express');
const app = express();
// import the router
const router = express.Router();

const Group = require('../models/group');
const GroupController = require('../controllers/groupController');

const authorization = require('../middleware/authorization');

// autocomplete search for groups
router.get('/', async (req, res) => {
    const { searchterm, number } = req.query;
    if (number) {
        console.log(`looking for number ${number}`);
    }

    const regex = new RegExp(searchterm, 'i');
    // if is private, the user must be within the list of members.
    Group.find().or([{ name: regex, isPrivate: false }, { name: regex, members: req.user }, { hospitalName: regex, isPrivate: false }, { hospitalName: regex, members: req.user }]).limit(parseInt(number))
    .then(groupsFoundByName => {
        console.log(groupsFoundByName);
        return res.json({ groups: groupsFoundByName });
    })
    .catch(error => {
        console.log(error);
        return res.json({ message: `error searching with string ${req.query.searchterm}`});
    });
});

router.get('/:groupId', (req, res) => {
    const { groupId } = req.params;
    Group.findById(groupId)
    .then(foundGroup => {
        return res.json(foundGroup)
    })
    .catch(err => {
        console.log(err);
        const errorMsg = err.message || constants.UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});

router.post('/', authorization.auth, async (req, res) => {
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