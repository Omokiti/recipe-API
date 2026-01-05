// const multer = require('multer')
// const { CloudinaryStorage } = require('multer-storage-cloudinary')
// const { cloudinary } = require('../utility/cloudinary.js')


// const storage =  new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "recipez", // Folder name in Cloudinary
//     allowed_formats: ["jpg", "png", "jpeg"],
//     transformation: [{ width: 800, height: 800, crop: "limit" }],
//   },
// });

// const upload = multer({
//     storage,
//     limits: {
//       fileSize: 5 * 1024 * 1024, // 5MB limit (recommended)
//     },
//     fileFilter: (req, file, cb) => {
//       const allowedTypes = /jpeg|jpg|png/;
//       const extname = allowedTypes.test(file.originalname.toLowerCase());
//       const mimetype = allowedTypes.test(file.mimetype);
  
//       if (mimetype && extname) {
//         return cb(null, true);
//       } else {
//         cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
//       }
//     },
//   });

// module.exports =upload; 
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utility/cloudinary.js')

// 1. Define Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'recipe_images', // Optional folder name in Cloudinary
    format: async (req, file) => 'jpg', // supports promises as well
    public_id: (req, file) => `recipe-${Date.now()}`,
  },
});

// 2. Initialize Multer
const upload = multer({ storage: storage });

module.exports = { upload };




