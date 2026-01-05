
require('dotenv').config()

const express = require('express')
const cors = require('cors')

const app = express()

const Port = process.env.PORT

const passport = require('./utility/passport')

const authRoute =require('./route/auth')
const recipeRoute = require('./route/recipe')
//middleware

app.use(cors({
    origin: ["http://localhost:3000", // your frontend URL
    "https://your-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }));

app.use(express.json())
app.use(passport.initialize())

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/recipe',recipeRoute)

// app.get("/",(req,res)=>{
//     return res.send('API working')
// })

app.get("/test-db", async (req, res) => {
    try {
      const { prisma } = require('./lib/prisma');
      await prisma.$connect();
      res.send("Database connected successfully!");
    } catch (error) {
      res.status(500).send("DB Error: " + error.message);
    }
  });



module.exports= app;