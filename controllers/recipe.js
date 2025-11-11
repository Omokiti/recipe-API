
const { PrismaClient } = require("@prisma/client");
const { cloudinary } = require("../utility/cloudinary");
const prisma = new PrismaClient();

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
                    recipeId:Number(recipeId)
                }
            }
        })
        if(existingLike){
            await prisma.like.delete({
                where:{
                    userId_recipeId:{
                        userId,
                        recipeId:Number(recipeId)
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

 const updateRecipe =async(req,res)=>{
    const{ recipeId}=req.params;
    const{ title, description, ingredients, steps ,prepTime }= req.body
    const userId = req.user.id;

    try {
        const recipe = await prisma.recipe.findUnique({where:{id:Number(recipeId)}});
        if(!recipe || recipe.authorId !== userId){
            return res.status(403).json({error:'Not allowed'})
        }

        let imageUrl = recipe.image
        let imagePublicId = recipe.imagePublicId

        if(req.file){
            if(recipe.imagePublicId){
                await cloudinary.uploader.destroy(recipe.imagePublicId)
            }
        }
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "recipez",
          });
    
          imageUrl = uploadResult.secure_url;
          imagePublicId = uploadResult.public_id;
        
        const updated = await prisma.recipe.update({
            where:{id:Number(recipeId)},
            data:{
            title,
            description,
            ingredients:Array.isArray(ingredients)
            ? ingredients
            : ingredients.split(',').map(i => i.trim()),
            steps:Array.isArray(steps)
            ? steps
            : steps.split(',').map(s => s.trim()),
            prepTime,
            image:imageUrl,
            imagePublicId
        
        }
        });
        res.json(updated)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

const deleteRecipe=async(req,res)=>{
    const{recipeId}=req.params
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
searchByIngredient,
togglelikeRecipe,
updateRecipe,
addComment,
getComment,
deleteRecipe
}
