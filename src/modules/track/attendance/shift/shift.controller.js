const Shift = require("./shift.model")
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createShift = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        const companyId = req.user?.companyId
        const {
            title,
            description,
            shiftCategory,
            shiftTimings,
            colorCode,
            isActive,
            companyOfficeId,
        } = req.body;
        let officeIds = [];

        if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
        }
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

        const formattedShiftTimings = shiftTimings?.map((shift) => ({
      startTime: shift.startTime,
      endTime: shift.endTime,

      startOff: {
        hours: Number(shift?.startOff?.hours || 0),
        minutes: Number(shift?.startOff?.minutes || 0),
      },

      cutOff: {
        hours: Number(shift?.cutOff?.hours || 0),
        minutes: Number(shift?.cutOff?.minutes || 0),
      },
    }));

        const shift = await Shift.create({
            adminId,
            companyId,
            title,
            description,
            shiftCategory,
            shiftTimings: formattedShiftTimings,
            colorCode,
            isActive: isActive ?? true,
            companyOfficeId: officeIds,
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
        const data = await populateEmployeeDetails(shifts);

        res.status(200).json({
            success: true,
            count: data.length,
            data
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

        const data = await populateEmployeeDetails(shift);

        res.status(200).json({
            success: true,
            data
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

        const data = await populateEmployeeDetails(shift);

        res.status(200).json({
            success: true,
            message: "Shift updated successfully",
            data
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



