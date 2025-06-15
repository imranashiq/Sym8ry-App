const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const userAuth = require("../middlewares/userAuth");
const upload = require('../utills/upload');

// router.post('/', userController.createUser);
// router.get('/', userController.getAllUsers);
router.get('/getProfile',userAuth, userController.getUserById);
router.put('/updateProfile',userAuth,upload.single("image"), userController.updateUser);
// router.delete('/:id', userController.deleteUser);

module.exports = router;
