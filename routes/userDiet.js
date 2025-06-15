const express = require('express');
const router = express.Router();
const userDietController = require('../controllers/userDiet');
const userAuth = require("../middlewares/userAuth");

router.post('/createUserDiet', userAuth,userDietController.createUserDiet);
router.get('/getAllUserDiets',userAuth, userDietController.getAllUserDiets);
router.get('/getUserDietById/:id', userDietController.getUserDietById);
router.put('/updateUserDiet/:id', userDietController.updateUserDiet);
router.delete('/deleteUserDiet/:id', userDietController.deleteUserDiet);

module.exports = router;
