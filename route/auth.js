const express = require('express')
const passport = require('../utility/passport')

const authRoute = express.Router()
const {signUpUser,verifyOtp,loginUser,getUser} = require('../controllers/auth')
authRoute.post('/signup-user',signUpUser)
authRoute.post('/login-user',loginUser)
authRoute.post('/verify-otp',verifyOtp)
authRoute.get('/user',passport.authenticate('jwt',{ session:false}),getUser)

module.exports=authRoute
