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


// export the module
module.exports = router;