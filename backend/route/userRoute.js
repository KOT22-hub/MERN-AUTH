const express = require('express');
const { getUserdata } = require('../controllers/userController');
const { userAuth } = require('../middleware/userAuth');
const userRouter = express.Router();

userRouter.get('/data',userAuth,getUserdata)


module.exports={userRouter}