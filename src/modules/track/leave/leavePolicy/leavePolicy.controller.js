const LeavePolicy = require("./leavePolicy.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createLeavePolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;
    const data = req.body;

    if (!data.policyName) {
      return res.status(400).json({
        success: false,
        message: "policyName is required",
      });
    }

    // ===============================
    // OFFICE ARRAY FIX
    // ===============================
    const officeIds = Array.isArray(data.companyOfficeId)
      ? data.companyOfficeId
      : data.companyOfficeId
      ? [data.companyOfficeId]
      : [];

    // ===============================
    // HOURLY LEAVE
    // ===============================
    const hourlyLeave = (data.hourlyLeave || []).map((item) => ({
      hourlyleaveName: item.hourlyleaveName || "",
      maxHours: item.maxHours || 0,
      employmentType: item.employmentType || "",

      prorateFromJoiningDate: item.prorateFromJoiningDate || false,
      joinMonthCalc: item.joinMonthCalc ?? true,
      halfMonthCalc: item.halfMonthCalc ?? true,
      joinAfterDays: item.joinAfterDays || 0,

      proratefromPrabationEndDate:
        item.proratefromPrabationEndDate || false,
      includeExtend: item.includeExtend || false,
      calcLeaveEndMonth: item.calcLeaveEndMonth || false,
      calcHalfLeaves: item.calcHalfLeaves || false,
      endMonthDays: item.endMonthDays || 0,

      doNotprobationRate: item.doNotprobationRate || false,

      donotProRate: {
        donotSelectRate: item.donotProRate?.donotSelectRate || 0,
        donotDays: item.donotProRate?.donotDays || 0,
        donotMonths: item.donotProRate?.donotMonths || "",
        elseEmployee: item.donotProRate?.elseEmployee || "",
      },

      leaveBalanceStartMonth: item.leaveBalanceStartMonth || false,
      leaveBalanceCred: item.leaveBalanceCred || false,

      carryUnsendLeaves: item.carryUnsendLeaves || false,
      carryForward: item.carryForward || false,

      minHoursPerDay: item.minHoursPerDay || 0,
      leaveHours: item.leaveHours || 0,

      leaveApproval: item.leaveApproval || false,
      leaveBypass: item.leaveBypass || false,
      AutoApprove: item.AutoApprove || false,
    }));

    // ===============================
    // COMMON FUNCTION (REUSE FOR MEDICAL + CUSTOM)
    // ===============================
    const mapAdvancedLeave = (item) => ({
      // NAME
      ...(item.MedicalleaveName && { MedicalleaveName: item.MedicalleaveName }),
      ...(item.customleaveName && { customleaveName: item.customleaveName }),

      // Allocation
      automaticallyLeaveBalance: item.automaticallyLeaveBalance || false,
      Days: item.Days || 0,
      manuallyLeaveBalance: item.manuallyLeaveBalance || false,

      // Who
      gender: item.gender || "",
      employmentType: item.employmentType || "",
      maritalStatus: item.maritalStatus || "",

      // Calculation
      prorateFromJoiningDate: item.prorateFromJoiningDate || false,
      joinMonthCalc: item.joinMonthCalc ?? true,
      halfMonthCalc: item.halfMonthCalc ?? true,
      joinAfterDays: item.joinAfterDays || 0,

      proratefromPrabationEndDate:
        item.proratefromPrabationEndDate || false,
      includeExtend: item.includeExtend || false,
      calcLeaveEndMonth: item.calcLeaveEndMonth || false,
      calcHalfLeaves: item.calcHalfLeaves || false,
      endMonthDays: item.endMonthDays || 0,

      doNotprobationRate: item.doNotprobationRate || false,

      donotProRate: {
        donotSelectRate: item.donotProRate?.donotSelectRate || 0,
        donotDays: item.donotProRate?.donotDays || 0,
        donotMonths: item.donotProRate?.donotMonths || "",
        elseEmployee: item.donotProRate?.elseEmployee || "",
      },

      // Balance
      leaveBalanceAccured: item.leaveBalanceAccured || false,
      leaveBalanceCredit: item.leaveBalanceCredit || false,

      creditDuring: item.creditDuring || false,
      creditDays: item.creditDays || 0,

      // Attachment
      compulsoryLeave: item.compulsoryLeave || false,
      documentRequiredLeaveDays:
        item.documentRequiredLeaveDays || 0,
      descriptionEmployee: item.descriptionEmployee || "",

      // Probation
      MaximumDays: item.MaximumDays || 0,
      accumaltionBalance: item.accumaltionBalance || false,
      employeesProbation: item.employeesProbation || false,

      // After confirm
      period: item.period || "",
      maximumLeaves: item.maximumLeaves || 0,
      consecutiveLeaves: item.consecutiveLeaves || 0,

      // Usage
      halfDay: item.halfDay || false,
      leaveApplications: item.leaveApplications || false,
      leaveduration: item.leaveduration || 0,
      Employee: item.Employee || 0,
      earlier: item.earlier || 0,
      leaveApplication: item.leaveApplication || false,
      leaveApplicationDays: item.leaveApplicationDays || 0,

      // Sandwich
      deductLeave: item.deductLeave || false,

      deductMandatory: item.deductMandatory || {},
      deductOptional: item.deductOptional || {},
      deductWeekly: item.deductWeekly || {},

      // Carry forward
      balanceLapse: item.balanceLapse || false,

      carryForward: {
        carrySelect: item.carryForward?.carrySelect || "",
        UnusedLeaves: item.carryForward?.UnusedLeaves || 0,
      },

      enCash: {
        carrySelect: item.enCash?.carrySelect || "",
        UnusedLeaves: item.enCash?.UnusedLeaves || 0,
      },

      // Gift
      employeeGift: item.employeeGift || false,
      giftPerYear: item.giftPerYear || 0,
      receivedGiftLeaves: item.receivedGiftLeaves || false,
    });

    // ===============================
    // MEDICAL LEAVE
    // ===============================
    const medicalLeave = (data.medicalLeave || []).map(mapAdvancedLeave);

    // ===============================
    // CUSTOM LEAVE (NOW SAME STRUCTURE)
    // ===============================
    const customLeave = (data.customLeave || []).map(mapAdvancedLeave);

    // ===============================
    // CREATE
    // ===============================
    const newPolicy = await LeavePolicy.create({
      policyName: data.policyName,
      description: data.description || "",

      unpaidLeaveName: data.unpaidLeaveName || "",
      leaveUsageLimit: data.leaveUsageLimit || "",
      leaveMaximumDays: data.leaveMaximumDays || 0,
      maximumLeaves: data.maximumLeaves || 0,

      halfDayLeave: data.halfDayLeave || false,
      leaveApplications: data.leaveApplications || false,
      leaveduration: data.leaveduration || 0,
      Employee: data.Employee || 0,
      earlier: data.earlier || 0,
      leaveApplication: data.leaveApplication || false,
      leaveApplicationDays: data.leaveApplicationDays || 0,

      deductLeave: data.deductLeave || false,
      deductMandatory: data.deductMandatory || {},
      deductOptional: data.deductOptional || {},
      deductWeekly: data.deductWeekly || {},

      LeavesClubbing: data.LeavesClubbing || false,
      typeleaves: data.typeleaves || 0,

      hourlyLeave,
      medicalLeave,
      customLeave,

      assignedEmployeeList: data.assignedEmployeeList || [],

      companyOfficeId: officeIds,
      companyId,
      adminId,
      status: data.status || "draft",
    });

    return res.status(201).json({
      success: true,
      message: "Leave Policy Created Successfully",
      data: newPolicy,
    });

  } catch (error) {
    console.error("Create Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllLeavePolicies = async (req, res) => {
  try {
        const companyId = req.user?.companyId; 
    const { page = 1, limit = 10, search, status } = req.query;

     const query = {
      companyId: companyId ,
       isDeleted: false   // ✅ filter by company
    };


    if (status) {
      query.status = status;
    }

    if (search) {
      query.policyName = { $regex: search, $options: "i" };
    }

    const policies = await LeavePolicy.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await LeavePolicy.countDocuments(query);
    const populatedPolicies = await populateEmployeeDetails(policies);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: populatedPolicies,
    });
  } catch (error) {
    console.error("GetAll Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getOneLeavePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    const policy = await LeavePolicy.findById(id);

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Leave Policy Not Found",
      });
    }

    const data = await populateEmployeeDetails(policy);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GetOne Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.updateLeavePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    // ===============================
    // FIND EXISTING
    // ===============================
    const existingPolicy = await LeavePolicy.findById(id);

    if (!existingPolicy) {
      return res.status(404).json({
        success: false,
        message: "Leave Policy Not Found",
      });
    }

    // ===============================
    // OFFICE ARRAY FIX
    // ===============================
    const officeIds = data.companyOfficeId
      ? Array.isArray(data.companyOfficeId)
        ? data.companyOfficeId
        : [data.companyOfficeId]
      : existingPolicy.companyOfficeId;

    // ===============================
    // HOURLY LEAVE (ONLY IF SENT)
    // ===============================
    const hourlyLeave = data.hourlyLeave
      ? data.hourlyLeave.map((item) => ({
          hourlyleaveName: item.hourlyleaveName || "",
          maxHours: item.maxHours || 0,
          employmentType: item.employmentType || "",

          prorateFromJoiningDate:
            item.prorateFromJoiningDate || false,
          joinMonthCalc: item.joinMonthCalc ?? true,
          halfMonthCalc: item.halfMonthCalc ?? true,
          joinAfterDays: item.joinAfterDays || 0,

          proratefromPrabationEndDate:
            item.proratefromPrabationEndDate || false,
          includeExtend: item.includeExtend || false,
          calcLeaveEndMonth: item.calcLeaveEndMonth || false,
          calcHalfLeaves: item.calcHalfLeaves || false,
          endMonthDays: item.endMonthDays || 0,

          doNotprobationRate: item.doNotprobationRate || false,

          donotProRate: {
            donotSelectRate:
              item.donotProRate?.donotSelectRate || 0,
            donotDays: item.donotProRate?.donotDays || 0,
            donotMonths:
              item.donotProRate?.donotMonths || "",
            elseEmployee:
              item.donotProRate?.elseEmployee || "",
          },

          leaveBalanceStartMonth:
            item.leaveBalanceStartMonth || false,
          leaveBalanceCred: item.leaveBalanceCred || false,

          carryUnsendLeaves:
            item.carryUnsendLeaves || false,
          carryForward: item.carryForward || false,

          minHoursPerDay: item.minHoursPerDay || 0,
          leaveHours: item.leaveHours || 0,

          leaveApproval: item.leaveApproval || false,
          leaveBypass: item.leaveBypass || false,
          AutoApprove: item.AutoApprove || false,
        }))
      : existingPolicy.hourlyLeave;

    // ===============================
    // COMMON MAPPER
    // ===============================
    const mapAdvancedLeave = (item) => ({
      ...(item.MedicalleaveName && {
        MedicalleaveName: item.MedicalleaveName,
      }),
      ...(item.customleaveName && {
        customleaveName: item.customleaveName,
      }),

      automaticallyLeaveBalance:
        item.automaticallyLeaveBalance || false,
      Days: item.Days || 0,
      manuallyLeaveBalance:
        item.manuallyLeaveBalance || false,

      gender: item.gender || "",
      employmentType: item.employmentType || "",
      maritalStatus: item.maritalStatus || "",

      prorateFromJoiningDate:
        item.prorateFromJoiningDate || false,
      joinMonthCalc: item.joinMonthCalc ?? true,
      halfMonthCalc: item.halfMonthCalc ?? true,
      joinAfterDays: item.joinAfterDays || 0,

      proratefromPrabationEndDate:
        item.proratefromPrabationEndDate || false,
      includeExtend: item.includeExtend || false,
      calcLeaveEndMonth: item.calcLeaveEndMonth || false,
      calcHalfLeaves: item.calcHalfLeaves || false,
      endMonthDays: item.endMonthDays || 0,

      doNotprobationRate: item.doNotprobationRate || false,

      donotProRate: {
        donotSelectRate:
          item.donotProRate?.donotSelectRate || 0,
        donotDays: item.donotProRate?.donotDays || 0,
        donotMonths:
          item.donotProRate?.donotMonths || "",
        elseEmployee:
          item.donotProRate?.elseEmployee || "",
      },

      leaveBalanceAccured:
        item.leaveBalanceAccured || false,
      leaveBalanceCredit:
        item.leaveBalanceCredit || false,

      creditDuring: item.creditDuring || false,
      creditDays: item.creditDays || 0,

      compulsoryLeave: item.compulsoryLeave || false,
      documentRequiredLeaveDays:
        item.documentRequiredLeaveDays || 0,
      descriptionEmployee:
        item.descriptionEmployee || "",

      MaximumDays: item.MaximumDays || 0,
      accumaltionBalance:
        item.accumaltionBalance || false,
      employeesProbation:
        item.employeesProbation || false,

      period: item.period || "",
      maximumLeaves: item.maximumLeaves || 0,
      consecutiveLeaves:
        item.consecutiveLeaves || 0,

      halfDay: item.halfDay || false,
      leaveApplications:
        item.leaveApplications || false,
      leaveduration: item.leaveduration || 0,
      Employee: item.Employee || 0,
      earlier: item.earlier || 0,
      leaveApplication:
        item.leaveApplication || false,
      leaveApplicationDays:
        item.leaveApplicationDays || 0,

      deductLeave: item.deductLeave || false,

      deductMandatory: item.deductMandatory || {},
      deductOptional: item.deductOptional || {},
      deductWeekly: item.deductWeekly || {},

      balanceLapse: item.balanceLapse || false,

      carryForward: {
        carrySelect:
          item.carryForward?.carrySelect || "",
        UnusedLeaves:
          item.carryForward?.UnusedLeaves || 0,
      },

      enCash: {
        carrySelect:
          item.enCash?.carrySelect || "",
        UnusedLeaves:
          item.enCash?.UnusedLeaves || 0,
      },

      employeeGift: item.employeeGift || false,
      giftPerYear: item.giftPerYear || 0,
      receivedGiftLeaves:
        item.receivedGiftLeaves || false,
    });

    const medicalLeave = data.medicalLeave
      ? data.medicalLeave.map(mapAdvancedLeave)
      : existingPolicy.medicalLeave;

    const customLeave = data.customLeave
      ? data.customLeave.map(mapAdvancedLeave)
      : existingPolicy.customLeave;

    // ===============================
    // FINAL UPDATE OBJECT
    // ===============================
    const updateData = {
      policyName: data.policyName ?? existingPolicy.policyName,
      description: data.description ?? existingPolicy.description,

      unpaidLeaveName:
        data.unpaidLeaveName ??
        existingPolicy.unpaidLeaveName,

      leaveUsageLimit:
        data.leaveUsageLimit ??
        existingPolicy.leaveUsageLimit,

      leaveMaximumDays:
        data.leaveMaximumDays ??
        existingPolicy.leaveMaximumDays,

      maximumLeaves:
        data.maximumLeaves ??
        existingPolicy.maximumLeaves,

      halfDayLeave:
        data.halfDayLeave ??
        existingPolicy.halfDayLeave,

      leaveApplications:
        data.leaveApplications ??
        existingPolicy.leaveApplications,

      leaveApplication:
        data.leaveApplication ??
        existingPolicy.leaveApplication,

      leaveApplicationDays:
        data.leaveApplicationDays ??
        existingPolicy.leaveApplicationDays,

      deductLeave:
        data.deductLeave ??
        existingPolicy.deductLeave,

      LeavesClubbing:
        data.LeavesClubbing ??
        existingPolicy.LeavesClubbing,

      hourlyLeave,
      medicalLeave,
      customLeave,

      companyOfficeId: officeIds,
    };

    // ===============================
    // UPDATE
    // ===============================
    const updatedPolicy = await LeavePolicy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    const result = await populateEmployeeDetails(updatedPolicy);

    return res.status(200).json({
      success: true,
      message: "Leave Policy updated successfully",
      data: result,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.deleteLeavePolicy = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deleted = await LeavePolicy.findOneAndUpdate(
      {
        _id: id,
        isDeleted: false, // 🔥 prevent double delete
      },
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true }
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "LeavePolicy not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "LeavePolicy deleted successfully (soft delete)",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};