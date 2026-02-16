const BrandingModel = require("./branding.model.js");
const uploadToS3 = require("../../../middlewares/s3Upload.js");


const brandingUpload = uploadToS3("account-management").fields([
  { name: "brandLogo", maxCount: 1 },
  { name: "loginCoverImage", maxCount: 1 },
]);


const createOrUpdateBranding = async (req, res) => {
  console.log("========== BRANDING API HIT ==========");
  console.log("Time:", new Date().toISOString());

  try {
    console.log("Step 1️⃣ - Checking req.user...");
    console.log("req.user:", req.user);

    const adminId = req.user?.userId;

    if (!adminId) {
      console.log("❌ AdminId not found in token");
      return res.status(401).json({ message: "Unauthorized. Company not found." });
    }

    console.log("✅ AdminId:", adminId);

    console.log("Step 2️⃣ - Checking body data...");
    console.log("req.body:", req.body);

    const { welcomeTitle, welcomeMessage } = req.body;

    console.log("welcomeTitle:", welcomeTitle);
    console.log("welcomeMessage:", welcomeMessage);

    console.log("Step 3️⃣ - Checking uploaded files...");
    console.log("req.files:", req.files);

    const payload = { adminId };

    if (req.files?.brandLogo?.[0]) {
      console.log("✅ brandLogo received");
      console.log("S3 Location:", req.files.brandLogo[0].location);
      payload.brandLogo = req.files.brandLogo[0].location;
    } else {
      console.log("⚠️ No brandLogo uploaded");
    }

    if (req.files?.loginCoverImage?.[0]) {
      console.log("✅ loginCoverImage received");
      console.log("S3 Location:", req.files.loginCoverImage[0].location);
      payload.loginCoverImage = req.files.loginCoverImage[0].location;
    } else {
      console.log("⚠️ No loginCoverImage uploaded");
    }

    if (welcomeTitle) payload.welcomeTitle = welcomeTitle;
    if (welcomeMessage) payload.welcomeMessage = welcomeMessage;

    console.log("Step 4️⃣ - Final Payload:");
    console.log(payload);

    console.log("Step 5️⃣ - Checking existing branding...");
    let branding = await BrandingModel.findOne({ adminId });
    console.log("Existing branding:", branding);

    if (!branding) {
      console.log("🆕 Creating new branding...");
      branding = await BrandingModel.create(payload);
      console.log("✅ Branding created successfully");
      return res.status(201).json({ message: "Branding created", branding });
    }

    console.log("✏️ Updating existing branding...");
    branding = await BrandingModel.findByIdAndUpdate(
      branding._id,
      payload,
      { new: true }
    );

    console.log("✅ Branding updated successfully");

    res.status(200).json({ message: "Branding updated", branding });

  } catch (err) {
    console.log("❌ ERROR OCCURRED");
    console.log("Error Message:", err.message);
    console.log("Full Error:", err);

    res.status(400).json({ message: err.message });
  }

  console.log("========== END BRANDING API ==========");
};


const getBranding = async (req, res) => {
  try {

    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const branding = await BrandingModel.findOne({ adminId });

    res.status(200).json({message:"branding fetch successfully" ,branding });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  brandingUpload,
  createOrUpdateBranding,
  getBranding,
};
