const ClockInMethod = require("./clockInMethod.model");

exports.createClockInMethod = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const addedByName = req.user?.name || "";
    const addedByImage = req.user?.image || "";

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin not found."
      });
    }

    const {
      deviceName,
      description = "",
      clockType = "only",
      trackBreak = false,
      breakDuration = {},
      hybrid = false,
      biometric,
      directionalDevice = false,
      webAttendance = false,
      ipRestriction = false,
      ipList = [],
      mobileAttendance = false,
      gpsAttendance = false,
      gpsList = [],
      isActive = true
    } = req.body;

    // ✅ Required Validation
    if (!deviceName?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device name is required"
      });
    }

    if (biometric === undefined) {
      return res.status(400).json({
        success: false,
        message: "Biometric field is required (true/false)"
      });
    }

    const clockInMethod = await ClockInMethod.create({
      adminId,
      addedByName,
      addedByImage,

      deviceName: deviceName.trim(),
      description,

      clockType,
      trackBreak,

      breakDuration: {
        hours: breakDuration?.hours ?? 0,
        minutes: breakDuration?.minutes ?? 0
      },

      hybrid,

      biometric,

      directionalDevice: biometric ? directionalDevice : false,

      webAttendance: !biometric ? webAttendance : false,
      ipRestriction: !biometric ? ipRestriction : false,
      ipList: !biometric ? ipList : [],

      mobileAttendance: !biometric ? mobileAttendance : false,
      gpsAttendance: !biometric ? gpsAttendance : false,
      gpsList: !biometric ? gpsList : [],

      isActive
    });

    return res.status(201).json({
      success: true,
      message: "Clock-in Method created successfully",
      data: clockInMethod
    });

  } catch (error) {
    console.error("Create ClockInMethod Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

exports.getAllClockInMethods = async (req, res) => {
  try {

    const methods = await ClockInMethod.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: methods.length,
      data: methods
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.validateWFH = async (req, res) => {
  try {
    const { employeeId } = req.body;

    // 1️⃣ Find WFH device from DB
    const device = await ClockInMethod.findOne({
      isActive: true,
      deviceName: { $in: ["Work From Home", "WFH"] }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: "WFH device not configured"
      });
    }

    // 2️⃣ Check employee assigned
    const isAssigned = device.assignedEmployeeList.some(
      emp => emp.employeeId?.toString() === employeeId
    );

    if (!isAssigned) {
      return res.status(403).json({
        success: false,
        message: "Employee not assigned to WFH device"
      });
    }

    // 3️⃣ Check mobile OR web enabled
    // if (!device.mobileAttendance && !device.webAttendance) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "WFH attendance not enabled (mobile/web disabled)"
    //   });
    // }

    // 4️⃣ If biometric true → do not allow manual
    // if (device.biometric) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "WFH manual attendance not allowed (biometric enabled)"
    //   });
    // }

    return res.status(200).json({
      success: true,
      mode: "manual"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};