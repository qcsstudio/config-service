const LeaveType = require("./leaveType.model");

// ✅ CREATE Leave Type
exports.createOrUpdateLeaveType = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const adminId = req.user?.userId;

    if (!companyId || !adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing company or admin info",
      });
    }

    const {
      customLeave,
      hourlyLeave,
      medicalLeave,
      unpaidLeave,
      birthdayLeave,
      marriageAnniversaryLeave,
      spouseBirthdayLeave,
      sabbaticalLeave,
      vacationLeave,
      maternityLeave,
      paternityLeave,
    } = req.body;

    const leaveType = await LeaveType.findOneAndUpdate(
      { companyId }, // find by company
      {
        companyId,
        adminId,

        customLeave: customLeave ?? false,
        hourlyLeave: hourlyLeave ?? false,
        medicalLeave: medicalLeave ?? false,
        unpaidLeave: unpaidLeave ?? false,

        birthdayLeave: birthdayLeave ?? false,
        marriageAnniversaryLeave: marriageAnniversaryLeave ?? false,
        spouseBirthdayLeave: spouseBirthdayLeave ?? false,

        sabbaticalLeave: sabbaticalLeave ?? false,
        vacationLeave: vacationLeave ?? false,

        maternityLeave: maternityLeave ?? false,
        paternityLeave: paternityLeave ?? false,
      },
      {
        new: true,
        upsert: true // create if not exists
      }
    );

    res.status(200).json({
      success: true,
      message: "Leave Type saved successfully",
      data: leaveType,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error saving Leave Type",
      error: error.message,
    });
  }
};

// ✅ UPDATE Leave Type
exports.updateLeaveType = async (req, res) => {
  try {
   const companyId = req.user?.companyId

    const updated = await LeaveType.findByIdAndUpdate(
      { companyId: companyId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Leave Type not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave Type updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Leave Type",
      error: error.message,
    });
  }
};

// ✅ GET All Leave Types
exports.getAllLeaveTypes = async (req, res) => {
  try {
    const { companyId } = req.query;

    const filter = {};
    if (companyId) {
      filter.companyId = companyId;
    }

    const leaveTypes = await LeaveType.find(filter)
      .populate("companyId", "companyName")
      .populate("adminId", "name email");

    res.status(200).json({
      success: true,
      count: leaveTypes.length,
      data: leaveTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Leave Types",
      error: error.message,
    });
  }
};

// ✅ GET Single Leave Type
exports.getLeaveTypeById = async (req, res) => {
  try {
// console.log(req.user)
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "CompanyId missing from token"
      });
    }

    const leaveType = await LeaveType.findOne({ companyId });

    if (!leaveType) {
      return res.status(404).json({
        success: false,
        message: "Leave Type not found"
      });
    }

    res.status(200).json({
      success: true,
      data: leaveType
    });

  } catch (error) {
    console.log(error, "error");

    res.status(500).json({
      success: false,
      message: "Error fetching Leave Type",
      error: error.message
    });
  }
};