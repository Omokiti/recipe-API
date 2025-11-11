
require('dotenv').config()

const express = require('express')

const app = express()

const Port = process.env.PORT

const passport = require('./utility/passport')

const authRoute =require('./route/auth')
const recipeRoute = require('./route/recipe')
//middleware

app.use(express.json())
app.use(passport.initialize())

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/recipe',recipeRoute)

app.get("/",(req,res)=>{
    return res.send('hi emamuzo')
})
app.listen(Port,()=>{
    console.log(`server is listening in port ${Port}`)
})