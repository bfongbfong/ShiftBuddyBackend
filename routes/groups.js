// require express
const express = require('express');
// import the router
const router = express.Router();

const Group = require('../models/group');
const GroupController = require('../controllers/groupController');

const authorization = require('../middleware/authorization');
const Constants = require('../util/constants');

const { UKNOWN_ERROR } = Constants;

// CREATE
router.post('/', authorization.auth, (req, res) => {
    console.log('a new group is being made');

    GroupController.createNewGroup(req.body, req.user)
    .then(resObj => {
        res.json(resObj);
    })
    .catch(err => {
        res.status(err.code || 500).json({ errorMessage: err.message });
    })
});

// READ
router.get('/:groupId', (req, res) => {
    const { groupId } = req.params;
    Group.findById(groupId)
    .then(group => {
        if (!group) {
            return res.status(404).json({ errorMessage: 'Group not found.' });
        }
        return res.json({ group });
    })
    .catch(err => {
        console.log(err);
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});

// UPDATE
router.patch('/:groupId', (req, res) => {
    Group.findByIdAndUpdate(
        req.params.groupId, 
        req.body, { new: true, runValidators: true })
    .then(group => {
        if (!group) {
            return res.status(404).json({ errorMessage: 'Group not found.' });
        }
        return res.json({ group });
    })
    .catch(err => {
        console.log(err);
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
})

// DESTROY
router.delete('/:groupId', (req, res) => {
    Group.findByIdAndDelete(req.params.groupId)
    .then(group => {
        if (!group) {
            return res.status(404).json({ errorMessage: 'Group not found.' });
        }
        return res.json({ message: `Succesfully deleted group ${ group._id} `});
    })
    .catch(err => {
        console.log(err);
        const errorMsg = err.message || UKNOWN_ERROR;
        return res.status(err.code || 500).json({ errorMessage: errorMsg });
    })
});


// autocomplete search for groups
router.get('/', async (req, res) => {
    const { searchterm, number } = req.query;
    if (number) {
        console.log(`looking for number ${number}`);
    }

    const regex = new RegExp(searchterm, 'i');
    // if is private, the user must be within the list of members.
    Group.find().or([{ name: regex, isPrivate: false }, { name: regex, members: req.user }, { hospitalName: regex, isPrivate: false }, { hospitalName: regex, members: req.user }]).limit(parseInt(number))
    .then(groups => {
        console.log(groups);
        return res.json({ groups });
    })
    .catch(error => {
        console.log(error);
        return res.json({ message: `error searching with string ${req.query.searchterm}`});
    });
});


// export the module
module.exports = router;