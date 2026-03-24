const AttendanceLockCycle = require("./attendaceLock.model");

// CREATE / UPDATE
exports.upsertAttendanceLockCycle = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const {
      isAttendanceLocked,
      lockStartDay,
      lockEndDay,
      regularizationCutOffDays,
      isCycleBypassEnabled,
      description,
    } = req.body;

    const data = {
      adminId,
      companyId,
      isAttendanceLocked,
      lockStartDay,
      lockEndDay,
      regularizationCutOffDays,
      isCycleBypassEnabled,
      description,
    };

    const result = await AttendanceLockCycle.findOneAndUpdate(
      { companyId }, // 🔥 important
      { $set: data },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Attendance lock cycle saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

exports.getAttendanceLockCycle = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    const data = await AttendanceLockCycle.findOne({ companyId });

    if (!data) {
      return res.status(200).json({
        success: true,
        message: "No data found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};