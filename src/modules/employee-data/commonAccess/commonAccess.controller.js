const CommonAccess = require("./commonAccess.model")

const saveCommonAccess = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { id } = req.params;

    const { department, organization, calendarDataLevel } = req.body;

    // Build whosInToday object automatically
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

    if (id) {
      // UPDATE
      result = await CommonAccess.findByIdAndUpdate(
        id,
        {
          $set: {
            whosInToday,
            calendarDataLevel
          }
        },
        { new: true, runValidators: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Record not found" });
      }

    } else {
      // CREATE
      if (!adminId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const existing = await CommonAccess.findOne({ adminId });

      if (existing) {
        return res.status(400).json({
          message: "Already exists. Use update API."
        });
      }

      result = await CommonAccess.create({
        adminId,
        whosInToday,
        calendarDataLevel
      });
    }

    return res.status(200).json({
      message: id ? "Updated successfully" : "Created successfully",
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
    const { id } = req.params;

    const data = await CommonAccess.findById(id);

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
