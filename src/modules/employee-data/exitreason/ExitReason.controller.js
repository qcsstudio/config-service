const ExitReason = require("./ExitReason.model")

module.exports = {
    createExitReason: async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { exitType, description,companyOfficeId } = req.body;
let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }
    const addedById = req.user?.id || adminId;
    const addedByName = req.user?.name || "Unknown";
    const addedByImagePath = req.user?.image || "";

    const newExitReason = new ExitReason({
      adminId,
      exitType,
      description,
      addedById,
       companyOfficeId: officeIds,
      addedByName,
      addedByImagePath,
    });

    const savedData = await newExitReason.save();

    res.status(201).json({
      message: "Exit reason created successfully",
      data: savedData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
},


    Exit_reason_update: async (req, res) => {
        try {
            const { id } = req.params;
            const { isActive } = req.query;
            // if (typeof isActive !== "boolean") {
            //     return res.status(400).json({
            //         success: false,
            //         message: "isActive must be true or false"
            //     });
            // }

            const updatedExitReason = await ExitReason.findByIdAndUpdate(
                id,
                { isActive },
                { new: true }
            );

            if (!updatedExitReason) {
                return res.status(404).json({
                    success: false,
                    message: "Exit reason not found"
                });
            }

            res.status(200).json({
                message: "Status updated successfully",
                data: updatedExitReason
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message
            });
        }
    },

getExitReasons : async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { country } = req.query;

    if (!adminId) return res.status(401).json({ message: "Unauthorized" });

    let reasons = await ExitReason.find({ adminId }).sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      });

    if (country) reasons = reasons.filter(r => r.companyOfficeId !== null);

    res.status(200).json({
      message: "Exit reasons fetched successfully",
      count: reasons.length,
      data: reasons,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }



}
}