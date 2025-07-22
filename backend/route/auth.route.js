const authcontroller= require('../controllers/authControllers');
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/userAuth')
router.post('/register',authcontroller.register);
router.post('/login',authcontroller.Login);
router.post('/logout',authcontroller.Logout);
router.post('/verify-OTP',checkAuth.userAuth,authcontroller.sendverifyOTP);
router.post('/verify-Account',checkAuth.userAuth,authcontroller.verifyEmail);
router.post('/send-reset-OTP',checkAuth.userAuth,authcontroller.sendResetOTP);
router.post('/reset-password',checkAuth.userAuth,authcontroller.ResetPassword);










module.exports=router;