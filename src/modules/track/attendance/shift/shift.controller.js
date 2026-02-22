const Shift = require("./shift.model")

exports.createShift = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const addedByName = req.user?.name;
    const addedByImage = req.user?.image;
    const companyId = req.user?.companyId
    const {
      title,
      description,
      shiftCategory,
      shiftTimings,
      colorCode,
      isActive
    } = req.body;

    // ✅ Validation
    // if (
    //   !adminId ||
    //   !title ||
    //   !shiftCategory ||
    //   !Array.isArray(shiftTimings) ||
    //   shiftTimings.length === 0
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Required fields are missing or invalid"
    //   });
    // }

    const shift = await Shift.create({
      adminId,
      companyId,
      addedByName,
      addedByImage,
      title,
      description,
      shiftCategory,
      shiftTimings,
      colorCode,
      isActive: isActive ?? true
    });

    res.status(201).json({
      success: true,
      message: "Shift created successfully",
      data: shift
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/shifts
exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.find();

    res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET /api/shifts/:id
exports.getShiftById = async (req, res) => {
  try {
    const shift = await Shift.findById(req.params.id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    res.status(200).json({
      success: true,
      data: shift
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// PUT /api/shifts/:id
exports.updateShift = async (req, res) => {
  try {

    const {
      adminId,
      title,
      description,
      shiftCategory,
      shiftTimings,
      colorCode,
      isActive
    } = req.body;

    // ✅ Validation
    // if (
    //   !title ||
    //   !shiftCategory ||
    //   !Array.isArray(shiftTimings) ||
    //   shiftTimings.length === 0
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Required fields are missing or shiftTimings invalid"
    //   });
    // }

    const updateData = {
      adminId,
      title,
      description,
      shiftCategory,
      shiftTimings,
      colorCode,
      isActive
    };

    const shift = await Shift.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Shift updated successfully",
      data: shift
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE /api/shifts/:id
exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByIdAndDelete(req.params.id);

    if (!shift) {
      return res.status(404).json({
        success: false,
        message: "Shift not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Shift deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



