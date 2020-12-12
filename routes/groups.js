// require express
const express = require('express');
const app = express();
// import the router
const router = express.Router();

const GroupController = require('../controllers/groupController');


router.get('/', async (req, res) => {
    // make a groupController to handle logic
    // GroupController.getGroups() // method to get the groups a user belongs to. 

    console.log('groups was requested');
    // req.user is made in the authorization middleware
    return res.json({ groups: req.user.groups });
    // send a json response
    // res.json();
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