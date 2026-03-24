const LeavePolicy = require("./leavePolicy.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

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
companyOfficeId,
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
     if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
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

      companyOfficeId: officeIds,
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
        const companyId = req.user?.companyId; 
    const { page = 1, limit = 10, search, status } = req.query;

     const query = {
      companyId: companyId   // ✅ filter by company
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

    const updatedPolicy = await LeavePolicy.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedPolicy) {
      return res.status(404).json({
        success: false,
        message: "Leave Policy Not Found",
      });
    }

    const data = await populateEmployeeDetails(updatedPolicy);

    res.status(200).json({
      success: true,
      message: "Leave Policy updated successfully",
      data,
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