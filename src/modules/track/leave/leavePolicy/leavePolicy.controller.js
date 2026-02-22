const LeavePolicy = require("./leavePolicy.model");

exports.createLeavePolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId
    const companyId = req.user?.companyId
    const {
      // BASIC INFO
      policyName,
      description,
      selectedTypes,

      // USAGE POLICY
      leaveName,
      usageLimitType,
      maxDaysLeave,
      maxConsecutive,
      halfDay,
      limitFuture,
      allowPast,
      sandwiched,
      clubbing,
      futureDuration,
      futureApplyAtLeast,
      futureNotEarlier,
      pastDays,
      sandwichTypes,
      clubbingTypes,

      // HOURLY LEAVE
      hourlyName,
      maxHours,
      employmentType,
      calcType,
      prorateFrom,
      joinMonthCalc,
      joinAfterDays,
      includeExtendedProbation,
      probationMonthCalc,
      probationAfterDays,
      noProRateType,
      joinsOnOrBefore,
      joinsOnOrBeforeDays,
      joinsOnOrBeforeMonth,
      elseCalcFrom,
      disbursal,
      carryForward,
      carryType,
      minHoursPerDay,
      leaveHours,
      approval,

      // ADVANCED CONFIG
      allocation,
      annualDays,
      gender,
      empType,
      marital,
      attachments,
      attachmentDays,
      attachmentNote,
      overutil,
      overutilType,
      deductFrom,
      carryForwardEnabled,
      carryFwdLimit,
      carryFwdUnused,
      encashEnabled,
      encashLimit,
      encashUnused,
      giftLeave,
      giftLeavesPerYear,
      giftReceive,

      // SYSTEM
      status

    } = req.body;

    // REQUIRED CHECK
    if (!policyName) {
      return res.status(400).json({
        success: false,
        message: "policyName are required",
      });
    }

    const newPolicy = await LeavePolicy.create({
      policyName,
      description,
      selectedTypes,

      leaveName,
      usageLimitType,
      maxDaysLeave,
      maxConsecutive,
      halfDay,
      limitFuture,
      allowPast,
      sandwiched,
      clubbing,
      futureDuration,
      futureApplyAtLeast,
      futureNotEarlier,
      pastDays,
      sandwichTypes,
      clubbingTypes,

      hourlyName,
      maxHours,
      employmentType,
      calcType,
      prorateFrom,
      joinMonthCalc,
      joinAfterDays,
      includeExtendedProbation,
      probationMonthCalc,
      probationAfterDays,
      noProRateType,
      joinsOnOrBefore,
      joinsOnOrBeforeDays,
      joinsOnOrBeforeMonth,
      elseCalcFrom,
      disbursal,
      carryForward,
      carryType,
      minHoursPerDay,
      leaveHours,
      approval,

      allocation,
      annualDays,
      gender,
      empType,
      marital,
      attachments,
      attachmentDays,
      attachmentNote,
      overutil,
      overutilType,
      deductFrom,
      carryForwardEnabled,
      carryFwdLimit,
      carryFwdUnused,
      encashEnabled,
      encashLimit,
      encashUnused,
      giftLeave,
      giftLeavesPerYear,
      giftReceive,

      companyId,
      adminId,
      status,
    });

    res.status(201).json({
      success: true,
      message: "Leave Policy Created Successfully",
      data: newPolicy,
    });

  } catch (error) {
    console.error("Create Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.getAllLeavePolicies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.policyName = { $regex: search, $options: "i" };
    }

    const policies = await LeavePolicy.find(query)
      .select("-assignedEmployeeList") // exclude assigned employees
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await LeavePolicy.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: policies,
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

    const policy = await LeavePolicy.findById(id)
      .select("-assignedEmployeeList");

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Leave Policy Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: policy,
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

    const updatedPolicy = await LeavePolicy.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select("-assignedEmployeeList");

    if (!updatedPolicy) {
      return res.status(404).json({
        success: false,
        message: "Leave Policy Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Leave Policy Updated Successfully",
      data: updatedPolicy,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};