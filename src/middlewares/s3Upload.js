const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../config/s3"); // your AWS config

const uploadToS3 = () => {
  return multer({
    storage: multerS3({
      s3,
      bucket: process.env.AWS_S3_BUCKET,
      key: (req, file, cb) => {
        const companyId = req.params.companyId || req.user?.companyId;
        if (!companyId) return cb(new Error("Company ID missing"));

        const ext = file.originalname.split(".").pop();
        cb(null, `companies/${companyId}/account-management.${ext}`);
      },
    }),
  });
};

module.exports = uploadToS3;
