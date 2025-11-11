const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const { cloudinary } = require('../utility/cloudinary.js')


const storage =  new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "recipez", // Folder name in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const upload = multer({
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit (recommended)
    },
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png/;
      const extname = allowedTypes.test(file.originalname.toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only .jpg, .jpeg, and .png files are allowed!'));
      }
    },
  });

module.exports =upload; 




