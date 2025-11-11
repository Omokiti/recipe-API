
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const{generateOtp,getExpiry} = require('../utility/otputils.js')
const{sendUserOTPEmail} = require('../utility/email.js')
const prisma = new PrismaClient();

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET




const signUpUser = async (req,res)=>{
    const{ email,password,username }=req.body
    try{
        const existingUser = await prisma.user.findUnique({ where:{ email }})
        if(existingUser){
            return res.status(400).json({message:'Email already in use'})
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                username,
                isVerified:false
            }
        }) 
        //generate otp

        await prisma.userOTP.updateMany({
            where: { email, verified: false },
            data: { verified: true }
          });

        const otp = generateOtp();
        await prisma.userOTP.create({
            data:{
            email:user.email,
            token:otp,
            expiresAt:getExpiry(),
            }
        })
       await sendUserOTPEmail(user.email,otp)
       return res.status(201).json({
        message:"User created.Please verify OTP sent to email",
        
    })
    }catch(err){
        console.error('Sign up error',err)
    res.status(500).json({error:'SignUp failed. Please try again'})
}
}

const verifyOtp = async(req,res)=>{
    const{ email, token,otp}=req.body;
    const submittedToken = (token || otp || "").toString().trim(); 
    try {
        //find otp record
        const otpRecord = await prisma.userOTP.findFirst({
            where: { email, verified: false },
            orderBy: { createdAt: "desc" } 
            
        })
        if(!otpRecord){
            return res.status(400).json({
            message:'Invalid or expired token'
            })
        }
               // check if expired
        if (otpRecord.expiresAt < new Date()) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
    
      // check if token matches
      if (otpRecord.token !== submittedToken) {
        return res.status(400).json({ message: "Invalid OTP." });
      }

        // mark user as verified
        await prisma.user.update({
            where:{ email},
            data:{ isVerified:true}
        })
            //mark otp as used
        await prisma.userOTP.update({
            where:{ id:otpRecord.id},
            data:{ verified:true}
        })
        return res.status(200).json({
            message:'User verified successfully'
        })
    } catch (error) {
        console.error("OTP Verification Error:", error)
        return res.status(500).json({ error: "OTP verification failed" });
        
    }

}

 const loginUser = async(req,res)=>{
    const{email,password} = req.body;
        try{
            const user = await prisma.user.findUnique({where:{email}})
            if(!user){
                return res.status(400).json({message:'invalid credentials'})
            }
            // check if verified
            if (!user.isVerified) {
                 return res.status(403).json({ message: "Please verify your account first" });
                }
            const isMatch = await bcrypt.compare(password, user.password);
             if(!isMatch){
                return res.status(400).json({message:'invalid credentials'})
             }
             const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1hr' });

          res.json({ token, user: { id: user.id, email: user.email} });
             
        }catch(err){
        return res.status(500).json({ error: err.message });
        }
}


const getUser = async(req,res)=>{
    try {
       
        const user = await prisma.user.findUnique({
            where:{id:req.user.id},
            select:{
            id:true,
            username:true,
            email:true,
            isVerified:true,
            created_at:true
            }
        })
        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({error:'failed to fetch user'})
        
    }
}
module.exports={
signUpUser,
loginUser,
verifyOtp,
getUser
}