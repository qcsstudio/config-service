const ClockInMethod = require("./clockInMethod.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createClockInMethod = async (req, res) => {
  try {
    const adminId = req.user?.userId;

 const companyId = req.user?.companyId
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
      isActive = true,
      companyOfficeId
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
     let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const clockInMethod = await ClockInMethod.create({
      adminId,

      companyId,

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
 companyOfficeId: officeIds,
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
 const { country } = req.query; 
    const methods = await ClockInMethod.find({ isDeleted: false})
        .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      })
      .sort({ createdAt: -1 });

   const filteredMethods = methods.filter(method => method.companyOfficeId && method.companyOfficeId.length > 0);

    const data = await populateEmployeeDetails(filteredMethods);


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


exports.deleteClockInMethod = async (req, res) => {
  try {
    // const adminId = req.user?.userId;
    const { id } = req.params;

    const method = await ClockInMethod.findOne({
      _id: id,
      isDeleted: false
    });

    if (!method) {
      return res.status(404).json({
        success: false,
        message: "Clock-in method not found"
      });
    }

    // ✅ Soft delete
    method.isDeleted = true;
    method.deletedAt = new Date();

    await method.save();

    return res.status(200).json({
      success: true,
      message: "Clock-in Method deleted (soft) successfully"
    });

  } catch (error) {
    console.error("Delete ClockInMethod Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
    });
  }
};

exports.updateClockInMethod = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing record
    const existing = await ClockInMethod.findOne({
      _id: id,
      isDeleted: false
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Clock-in method not found"
      });
    }

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
      ipList,
      mobileAttendance,
      gpsAttendance,
      gpsList,
      isActive,
    } = req.body;

    // ✅ Optional validation
    if (deviceName && !deviceName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Device name cannot be empty"
      });
    }

    // ✅ Handle officeIds
   

    // ✅ Update fields (only if provided)
    existing.deviceName = deviceName?.trim() || existing.deviceName;
    existing.description = description ?? existing.description;

    existing.clockType = clockType ?? existing.clockType;
    existing.trackBreak = trackBreak ?? existing.trackBreak;

    existing.breakDuration = {
      hours: breakDuration?.hours ?? existing.breakDuration?.hours ?? 0,
      minutes: breakDuration?.minutes ?? existing.breakDuration?.minutes ?? 0
    };

    existing.hybrid = hybrid ?? existing.hybrid;

    if (biometric !== undefined) {
      existing.biometric = biometric;

      // 🔥 Important logic (same as create)
      existing.directionalDevice = biometric ? (directionalDevice ?? false) : false;

      existing.webAttendance = !biometric ? (webAttendance ?? false) : false;
      existing.ipRestriction = !biometric ? (ipRestriction ?? false) : false;
      existing.ipList = !biometric ? (ipList ?? []) : [];

      existing.mobileAttendance = !biometric ? (mobileAttendance ?? false) : false;
      existing.gpsAttendance = !biometric ? (gpsAttendance ?? false) : false;
      existing.gpsList = !biometric ? (gpsList ?? []) : [];
    }

    existing.isActive = isActive ?? existing.isActive;

    await existing.save();

    return res.status(200).json({
      success: true,
      message: "Clock-in Method updated successfully",
      data: existing
    });

  } catch (error) {
    console.error("Update ClockInMethod Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message
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