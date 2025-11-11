const express = require('express')
const passport = require('../utility/passport')
const rateLimit = require('express-rate-limit')
const upload = require('../middleware/upload')
const recipeRoute = express.Router()

const sensitiveApiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 15, // Limit to 15 requests per minute
    message: 'Too many requests to the sensitive API, please try again later.',
  });

  const otherSpecificApiLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 20, // Limit to 20 requests per 5 minutes
    message: 'Too many requests to this API, please wait.',
  });

const{ createRecipe,getRecipes,searchByIngredient,togglelikeRecipe,updateRecipe,deleteRecipe,addComment,getComment }= require('../controllers/recipe')

recipeRoute.post('/create-recipe', passport.authenticate('jwt',{ session:false}), upload.single('image'),createRecipe )

recipeRoute.get('/get-recipe', otherSpecificApiLimiter,getRecipes, )

recipeRoute.get('/search',sensitiveApiLimiter,searchByIngredient)

recipeRoute.post('/:recipeId/like',passport.authenticate('jwt',{ session:false}),togglelikeRecipe)

recipeRoute.put('/:recipeId/update',passport.authenticate('jwt',{ session:false}),upload.single('image'),updateRecipe)
recipeRoute.delete('/:recipeId/delete',passport.authenticate('jwt',{ session:false}),deleteRecipe)
recipeRoute.post('/:recipeId/comment',passport.authenticate('jwt',{ session:false}),addComment)
recipeRoute.get('/:recipeId/view-comment',passport.authenticate('jwt',{ session:false}),getComment)
module.exports= recipeRoute
