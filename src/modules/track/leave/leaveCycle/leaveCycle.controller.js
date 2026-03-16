
const LeaveCycleSetting = require("./leaveCycle.model")
const mongoose = require("mongoose")
exports.createOrUpdateLeaveCycle = async (req, res) => {
  try {
    const { pendingLeaveOption } = req.body;

    const companyId = req.user?.companyId;
    const adminId = req.user?.userId;

    if (!pendingLeaveOption) {
      return res.status(400).json({
        success: false,
        message: "Pending leave option is required",
      });
    }

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company not found in token",
      });
    }

    const setting = await LeaveCycleSetting.findOneAndUpdate(
      { companyId }, // ✅ find by company
      {
        pendingLeaveOption,
        adminId,
        companyId
      },
      {
        new: true,
        upsert: true // ✅ create if not exists
      }
    );

    return res.status(200).json({
      success: true,
      message: "Leave cycle setting saved successfully",
      data: setting,
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
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Company not found in token",
      });
    }

    const data = await LeaveCycleSetting.find({ companyId });

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