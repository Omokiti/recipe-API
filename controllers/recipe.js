
// const { PrismaClient } = require("@prisma/client");
const prisma = require("../lib/prisma");
const { cloudinary } = require("../utility/cloudinary");
// const prisma = new PrismaClient();

const createRecipe = async(req,res)=>{
   const{title,description,ingredients,steps,prepTime} = req.body;
   const userId = req.user.id;
   
   try{
    
    const imageUrl = req.file?.path || null
    const publicId = req.file?.filename || null


    const recipe = await prisma.recipe.create({
        data:{
            title,
            description,
            ingredients:Array.isArray(ingredients)
            ? ingredients
            : ingredients.split(',').map(i => i.trim()),
            steps:Array.isArray(steps)
            ? steps
            : steps.split(',').map(s => s.trim()),
            prepTime:Number(prepTime),
            image:imageUrl,
            imagePublicId: publicId,
            author:{ connect:{ id:userId}}
        }
    })
    res.status(201).json(recipe)
   }catch(err){
    console.error(err);
   return res.status(400).json({error:err.message})
   }

}

const getRecipes =async(req,res)=>{
    try {
        const recipes = await prisma.recipe.findMany({
            include:{
             author:{select:{id:true,username:true} } ,
             comments:true,
             likes:true  
            },
            orderBy: { id:'desc'},
        });
        res.json(recipes);
    } catch (err) {
        console.error(err)
        return res.status(400).json({error:err.message})
    }
}




const getRecipeDetails =async(req,res)=>{
    const{ recipeId } = req.params
    try {
        const recipe = await prisma.recipe.findUnique({

            where: {
                id: Number(recipeId),
              },
              include: {
                comments: {
                  orderBy: {
                    createdAt: "desc",
                  },
                  include: {
                    author: {
                      select: {
                        username: true,
                      },
                    },
                  },
                },
              },
            
            });
        if(!recipe){
            return res.status(400).json({message:'Recipe not found'})
        }
        res.status(200).json(recipe)
    } catch (error) {
        console.error(error)
        return res.status(400).json({error:error.message})
    }
}

const myRecipe=async(req,res)=>{
    const authorId = req.user.id

    try {
        const recipes = await prisma.recipe.findMany({
            where:{
                authorId:authorId
            },
            orderBy:{id:'desc'}
        });
        if(recipes.length === 0){
            return res.status(400).json({message:'Recipe not found for this user'})
        }
        return res.status(200).json({
        count:recipes.length,
        recipes
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({error:error.message})
    }
}

const myActivity = async(req,res)=>{
    const userId = req.user.id
     try {
        const comments = await prisma.comment.findMany({
            where:{
            authorId:userId
            },
            include:{
            recipe:{
            select:{
             title:true
            }
            }
            },
            orderBy:{id:'desc'}
        });
        const likes = await prisma.like.findMany({
            where:{
            userId
            },
            include:{
            recipe:{
            select:{
            title:true
                }
            }
            }
        })
        if(comments.length === 0 && likes.length === 0){
            return res.status(400).json({message:'no activity found for this user'})
        }
        
        return res.status(200).json({
        comments,
        likes
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({error:error.message})
    }
}

const searchByIngredient = async(req,res)=>{
    const{ ingredient } = req.query

    if(!ingredient){
        return res.status(400).json({error:'Please provide an ingredient to search for'})
    }
    try {
    
    const allRecipes = await prisma.recipe.findMany()
    
    const filtered = allRecipes.filter((recipe) =>
    recipe.ingredients.some((ing) =>
      ing.toLowerCase().includes(ingredient.toLowerCase())
    )
  );

  if (filtered.length === 0) {
    return res
      .status(404)
      .json({ message: `No recipe found with ingredient similar to "${ingredient}"` });
  }
    
    res.status(200).json(filtered)
 }catch (error) {
        console.error(error)
        return res.status(400).json({error:error.message})
    }
}

const togglelikeRecipe=async(req,res)=>{
    const { recipeId } = req.params;
    const userId = req.user.id;

    try{
        const existingLike = await prisma.like.findUnique({
            where:{
                userId_recipeId:{
                    userId,
                    id:Number(recipeId)
                }
            }
        })
        if(existingLike){
            await prisma.like.delete({
                where:{
                    userId_recipeId:{
                        userId,
                        id:Number(recipeId),
                        
                    }
                }
            })
            return res.status(400).json({message:'Recipe unliked'})
        } else{
            const like = await prisma.like.create({
                data:{
                    recipe:{connect:{ id:Number(recipeId) }},
                    user:{connect:{ id:userId}},
                }
            })
        res.json({message:'Recipe liked',like});
        }
      
    }catch(err){
       
       return  res.status(400).json({error:err.message})
        } 
    }

    const updateRecipe = async (req, res) => {
        const { recipeId } = req.params;
        const { title, description, ingredients, steps, prepTime } = req.body;
        const userId = req.user.id;
    
        try {
            const recipe = await prisma.recipe.findUnique({ where: { id: Number(recipeId) } });
            if (!recipe || recipe.authorId !== userId) {
                return res.status(403).json({ error: 'Not allowed' });
            }
    
            const prepTimeNumber = Number(prepTime);
            if (isNaN(prepTimeNumber)) {
                return res.status(400).json({ message: "prepTime must be a number" });
            }
    
            // 1. Initialize with existing data
            let imageUrl = recipe.image;
            let imagePublicId = recipe.imagePublicId;
    
            // 2. ONLY run this block if a NEW file was uploaded
            if (req.file) {
                // Delete the old image from Cloudinary if it exists
                if (recipe.imagePublicId) {
                    await cloudinary.uploader.destroy(recipe.imagePublicId);
                }
    
                // Upload the NEW file
                const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "recipez",
                });
    
                imageUrl = uploadResult.secure_url;
                imagePublicId = uploadResult.public_id;
            }
    
            // 3. Update the database
            const updated = await prisma.recipe.update({
                where: { id: Number(recipeId) },
                data: {
                    title,
                    description,
                    ingredients: Array.isArray(ingredients)
                        ? ingredients
                        : ingredients.split(',').map(i => i.trim()),
                    steps: Array.isArray(steps)
                        ? steps
                        : steps.split(',').map(s => s.trim()),
                    prepTime: prepTimeNumber,
                    image: imageUrl, // Will be the old URL if no new file, or new URL if uploaded
                    imagePublicId
                }
            });
    
            res.status(200).json({ message: 'updated successfully', updated });
        } catch (err) {
            console.error(err);
            res.status(400).json({ error: err.message });
        }
    }

const deleteRecipe=async(req,res)=>{
    const{ recipeId }=req.params
    const userId = req.user.id
    try {
        const recipe = await prisma.recipe.findUnique({where:{id:Number(recipeId)}})
        
        if(!recipe){
        return res.status(404).json({error:'Recipe not found'})
        }
        if(!recipe|| recipe.authorId !== userId){
            return res.status(403).json({error:'Not authorized'})
        }

        if(recipe.imagePublicId){
            await cloudinary.uploader.destroy(recipe.imagePublicId) 
        
        }
            const deleted = await prisma.recipe.delete({
                where:{ id:Number(recipeId)},
               
            })

        res.json({message:'Recipe deleted',deleted})
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

 const addComment = async(req,res)=>{
    const {recipeId} = req.params;
    const { content } = req.body;
     const userId = req.user.id;

     try {
        const comment = await prisma.comment.create({
            data:{
                content,
                author:{connect: {id:userId}},
                recipe:{connect: {id:Number(recipeId)}}
            }
        })
        res.status(201).json(comment)
     } catch (err) {
        res.status(400).json({error:err.message})
     }
}

 const getComment = async(req,res)=>{
    const{ recipeId } = req.params
    try {
        const comments = await prisma.comment.findMany({
            where:{recipeId:Number(recipeId)},
            include:{
                author:{
                    select:{id:true,username:true}
                },
               
            },
        orderBy:{createdAt:'desc'}
        })
        if(comments.length === 0) {
         return res.status(404).json({message:'comment not found for this recipe'})
        }
        res.json(comments)
    } catch (err) {
        res.status(400).json({error:err.message})
    }
}

module.exports={
createRecipe,
getRecipes,
getRecipeDetails,
myRecipe,
searchByIngredient,
togglelikeRecipe,
updateRecipe,
addComment,
getComment,
deleteRecipe,
myActivity
}
