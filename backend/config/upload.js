const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "submissions",
    resource_type: "raw", // ✅ Changed from "auto" to "raw"
    allowed_formats: ["pdf"],
    public_id: (req, file) => {
      const name = file.originalname.split('.')[0];
      return `${name}-${Date.now()}`;
    },
  },
});


const upload = multer({ storage });
module.exports =  upload;
