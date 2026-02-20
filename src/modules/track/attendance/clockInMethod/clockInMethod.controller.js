const ClockInMethod = require("./clockInMethod.model");

exports.createClockInMethod = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const addedByName = req.user?.name;
    const addedByImage = req.user?.image;

    const {
      deviceName,
      description,
      clockType,
      trackBreak,
      breakDuration,
      hybrid,
      biometric,
      directionalDevice,
      webAttendance,
      ipRestriction,
      mobileAttendance,
      gpsAttendance,
      isActive
    } = req.body;

    // ✅ Required Validation
    if (!adminId || !deviceName || biometric === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const clockInMethod = await ClockInMethod.create({
      adminId,
      addedByName,
      addedByImage,

      deviceName,
      description,

      clockType,
      trackBreak,

      breakDuration: {
        hours: breakDuration?.hours || 0,
        minutes: breakDuration?.minutes || 0
      },
hybrid,
      biometric,
      directionalDevice: biometric ? directionalDevice : false,

      webAttendance: !biometric ? webAttendance : false,
      ipRestriction: !biometric ? ipRestriction : false,
      mobileAttendance: !biometric ? mobileAttendance : false,
      gpsAttendance: !biometric ? gpsAttendance : false,

      isActive: isActive ?? true
    });

    res.status(201).json({
      success: true,
      message: "Clock-in Method created successfully",
      data: clockInMethod
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
