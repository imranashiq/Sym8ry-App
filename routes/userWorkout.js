const express = require('express');
const router = express.Router();
const userWorkout = require('../controllers/userWorkout');
const upload = require('../utills/upload');
const userAuth = require("../middlewares/userAuth");


router.post('/createUserWorkout', userAuth,userWorkout.createUserWorkout);


module.exports = router;
