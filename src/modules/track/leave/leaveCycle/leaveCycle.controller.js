
const LeaveCycleSetting = require("./leaveCycle.model")
exports.createOrUpdateLeaveCycle = async (req, res) => {
  try {
    const { pendingLeaveOption } = req.body;
    const { id } = req.params; // pass _id in params when updating

    if (!pendingLeaveOption) {
      return res.status(400).json({
        success: false,
        message: "Pending leave option is required",
      });
    }

    // ✅ If ID exists → Update by _id
    if (id) {
      const updated = await LeaveCycleSetting.findByIdAndUpdate(
        id,
        { pendingLeaveOption },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: "Leave cycle setting not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Leave cycle setting updated successfully",
        data: updated,
      });
    }

    // ✅ If no ID → Create new
    const newSetting = await LeaveCycleSetting.create({
      pendingLeaveOption,
      adminId: req.user?.userId || null,
      companyId:req.user.companyId || null // only set during create
    });

    return res.status(201).json({
      success: true,
      message: "Leave cycle setting created successfully",
      data: newSetting,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Update Leave Cycle Setting by ID
 * @route   PUT /api/leave-cycle/:id
 */
// exports.updateLeaveCycleById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { pendingLeaveOption } = req.body;

//     const updated = await LeaveCycleSetting.findByIdAndUpdate(
//       id,
//       {
//         pendingLeaveOption,
//         adminId: req.user?.userId || null,
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({
//         success: false,
//         message: "Leave cycle setting not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

/**
 * @desc    Get Leave Cycle Setting
 * @route   GET /api/leave-cycle
 */
exports.getLeaveCycle = async (req, res) => {
  try {
    const data = await LeaveCycleSetting.findOne().sort({ createdAt: -1 });

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No leave cycle setting found",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};