// multer
const fs = require("fs");
const multer = require("multer");
const cloudinary = require("cloudinary");
const { resolve } = require("path");
const uploadsDir = "./src/uploads/";
const imagesDir = `${uploadsDir}images/`;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("ooo\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n reqreqreq", req);
    // make uploads directory if do not exist
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);

    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    try {
      console.log("\n\n\n\n\n\n\n\n File from Multer", file);
      var fileExtension = file.mimetype.split("/")[1];
      if (
        !file.originalname
          .toLowerCase()
          .match(/\.(jpg|jpeg|png|gif|svg|ico|webp)$/)
      ) {
        return cb(new Error("Only image files are allowed."));
      }
      console.log("\n\n\n\n\n\n\n\n after checking extension from Multer");

      cb(
        null,
        +Date.now() +
          "." +
          fileExtension +
          "." +
          file.originalname.toLowerCase()
      );
    } catch (err) {
      console.log("Error From Multer", err);
    }
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2 MB
  },
});
// console.log("\nlll\nllll\nnnnn", upload);
// exports.cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'screenShot', maxCount: 1 }, { name: 'icon', maxCount: 1 }, { name: 'files', maxCount: 1 }, { name: 'manifestFile', maxCount: 1 }, { name: 'crashLog', maxCount: 1 },])
exports.cpUpload = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "fileUpload", maxCount: 1 },
]);

// exports.cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'fileUpload', maxCount: 1 }])
exports.uploadSingle = upload.single("logo");
exports.upload = upload;
exports.uploadContentImage = upload.single("files");
exports.profileUpload = upload.fields([
  { name: "profileImage", maxCount: 1 },
  { name: "bannerImage", maxCount: 1 },
]);
exports.kycPersonalDoc = upload.fields([
  { name: "personalDocumentPassportFront", maxCount: 1 },
  { name: "personalDocumentPassportBack", maxCount: 1 },
  { name: "personalDocumentIDCardFront", maxCount: 1 },
  { name: "personalDocumentIDCardBack", maxCount: 1 },
  { name: "personalDocumentDrivingIDFront", maxCount: 1 },
  { name: "personalDocumentDrivingIDBack", maxCount: 1 },
  { name: "addressDocument", maxCount: 1 },
  { name: "additionalDocument", maxCount: 1 },
]);

exports.uploadToCloudinary = async (data) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(
      data,
      (result) => {
        resolve(result.secure_url);
      },
      { resource_type: "auto" }
    );
  });

  // return `oooooooooooo`
};
