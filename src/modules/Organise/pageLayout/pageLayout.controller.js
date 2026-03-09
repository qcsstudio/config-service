const PageLayout = require("./pageLayout.model");

exports.createOrUpdatePageLayout = async (req, res) => {
  try {

    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const { previewEnabled } = req.body;

    let pageMargins = req.body.pageMargins;

    if (typeof pageMargins === "string") {
      pageMargins = JSON.parse(pageMargins);
    }

    let updateData = {
      adminId,
      companyId
    };

    // header image
    if (req.files?.["headerImage"]) {
      const file = req.files["headerImage"][0];

      updateData["headerImage"] = {
        url: file.location,
        fileName: file.key,
        fileSize: file.size,
        fileType: file.mimetype.split("/")[1]
      };
    }

    // footer image
    if (req.files?.["footerImage"]) {
      const file = req.files["footerImage"][0];

      updateData["footerImage"] = {
        url: file.location,
        fileName: file.key,
        fileSize: file.size,
        fileType: file.mimetype.split("/")[1]
      };
    }

    if (previewEnabled !== undefined) {
      updateData.previewEnabled = previewEnabled;
    }

    if (pageMargins) {
      updateData["pageMargins.type"] = pageMargins.type;
      updateData["pageMargins.top"] = pageMargins.top;
      updateData["pageMargins.bottom"] = pageMargins.bottom;
      updateData["pageMargins.left"] = pageMargins.left;
      updateData["pageMargins.right"] = pageMargins.right;
    }

    const layout = await PageLayout.findOneAndUpdate(
      { companyId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Page layout saved successfully",
      data: layout
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getOnePageLayout = async (req, res) => {
    try {

        const companyId = req.user?.companyId; // from auth middleware

        const layout = await PageLayout.findOne({ companyId })

        if (!layout) {
            return res.status(404).json({
                success: false,
                message: "Page layout not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: layout
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};