const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgetPasswordOTP', authController.forgetPasswordOTP);
router.post('/verifyForgotPasswordOTP', authController.verifyForgotPasswordOTP);
router.post('/resetPassword', authController.resetPassword);
router.post('/resendOtp', authController.resendOtp);



module.exports = router;
