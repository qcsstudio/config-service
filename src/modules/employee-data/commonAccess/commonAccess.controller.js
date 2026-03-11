const CommonAccess = require("./commonAccess.model")

const saveCommonAccess = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const { department, organization, calendarDataLevel } = req.body;

    const whosInToday = {
      department: department || {},
      organization: organization || {}
    };

    // Safety toggle logic
    if (whosInToday.department && !whosInToday.department.enabled) {
      whosInToday.department.showClockInTime = false;
    }

    if (whosInToday.organization && !whosInToday.organization.enabled) {
      whosInToday.organization.showClockInTime = false;
    }

    let result;

    const existing = await CommonAccess.findOne({ companyId });

    if (existing) {

      // UPDATE
      result = await CommonAccess.findOneAndUpdate(
        { companyId },
        {
          $set: {
            whosInToday,
            calendarDataLevel
          }
        },
        { new: true, runValidators: true }
      );

      // If nothing updated return existing
      if (!result) {
        result = existing;
      }

    } else {

      if (!adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      result = await CommonAccess.create({
        adminId,
        companyId,
        whosInToday,
        calendarDataLevel
      });
    }

    return res.status(200).json({
      message: existing ? "Updated successfully" : "Created successfully",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


const getCommonAccessById = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const data = await CommonAccess.findOne({ companyId });

    if (!data) {
      return res.status(404).json({
        message: "Record not found"
      });
    }

    return res.status(200).json({
      data
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};



module.exports={
    saveCommonAccess,
    getCommonAccessById
}
