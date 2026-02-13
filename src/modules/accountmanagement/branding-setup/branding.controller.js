const BrandingModel = require("./branding.model.js");
const uploadToS3 = require("../../../middlewares/s3Upload.js");


const brandingUpload = uploadToS3("account-management").fields([
  { name: "brandLogo", maxCount: 1 },
  { name: "loginCoverImage", maxCount: 1 },
]);

const createOrUpdateBranding = async (req, res) => {
  try {

    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized. Company not found." });
    }

    const { welcomeTitle, welcomeMessage } = req.body;

    const payload = { companyId };

    if (req.files?.brandLogo?.[0]) {
      payload.brandLogo = req.files.brandLogo[0].location;
    }

    if (req.files?.loginCoverImage?.[0]) {
      payload.loginCoverImage = req.files.loginCoverImage[0].location;
    }

    if (welcomeTitle) payload.welcomeTitle = welcomeTitle;
    if (welcomeMessage) payload.welcomeMessage = welcomeMessage;

    let branding = await BrandingModel.findOne({ companyId });

    if (!branding) {
      branding = await BrandingModel.create(payload);
      return res.status(201).json({ message: "Branding created", branding });
    }

    branding = await BrandingModel.findByIdAndUpdate(
      branding._id,
      payload,
      { new: true }
    );

    res.status(200).json({ message: "Branding updated", branding });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getBranding = async (req, res) => {
  try {

    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const branding = await BrandingModel.findOne({ companyId });

    res.status(200).json({ branding });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  brandingUpload,
  createOrUpdateBranding,
  getBranding,
};
