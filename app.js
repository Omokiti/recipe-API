

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
  }

const express = require('express')
const cors = require('cors')

const app = express()

const Port = process.env.PORT

const passport = require('./utility/passport')

const authRoute =require('./route/auth')
const recipeRoute = require('./route/recipe')
//middleware

app.use(cors({
    origin : [   "http://localhost:3000", 'https://recipez-zeta.vercel.app'], // your frontend URL
    methods: ["GET", "POST", "PUT","PATCH", "DELETE","OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));

app.use(express.json())
app.use(passport.initialize())

app.use('/api/v1/auth',authRoute)
app.use('/api/v1/recipe',recipeRoute)

app.get("/",(req,res)=>{
    return res.send('API working')
})

app.get("/test-db", async (req, res) => {
    try {
      const prisma = require('./lib/prisma'); 
      await prisma.$connect();
      res.send("Database connected successfully!");
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
          message: "DB Error", 
          error: error.message,
          env: process.env.DATABASE_URL ? "URL is set" : "URL is MISSING" 
      });
    }
  });



module.exports= app;