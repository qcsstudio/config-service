const LeavePolicy = require("./leavePolicy.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createLeavePolicy = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      // ── BASIC INFO ──────────────────────────────────────────────
      policyName,
      description,
      selectedTypes,

      // ── USAGE POLICY  (s2 — Unpaid Leave) ──────────────────────
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
      sandwichSubTypes,       // ✅ ADDED
      clubbingTypes,

      // ── HOURLY LEAVE  (s3) ──────────────────────────────────────
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

      // ── ADVANCED LEAVE CONFIG  (s4) ─────────────────────────────
      leaveName4,             // ✅ ADDED

      allocation,
      annualDays,
      gender,
      empType,
      marital,

      // s4 calculation fields
      calcType4,              // ✅ ADDED
      prorateFrom4,           // ✅ ADDED
      joinCalc4,              // ✅ ADDED
      joinAfterDays4,         // ✅ ADDED
      extProbation4,          // ✅ ADDED
      probCalc4,              // ✅ ADDED
      probAfterDays4,         // ✅ ADDED
      noProRate4,             // ✅ ADDED
      joinsOnOrBefore4,       // ✅ ADDED
      joinsOnOrBeforeDays4,   // ✅ ADDED
      joinsMonth4,            // ✅ ADDED
      elseCalcFrom4,          // ✅ ADDED
      disbursal4,             // ✅ ADDED

      // s4 probation credit
      limitProbationCredit,   // ✅ ADDED
      creditUntilProbationSel,// ✅ ADDED
      creditUntilProbationDays,// ✅ ADDED

      // attachments
      attachments,
      attachmentDays,
      attachmentNote,

      // during probation
      maxProbationDays,       // ✅ ADDED
      accumProbation,         // ✅ ADDED
      applyDuringProbation1,  // ✅ ADDED
      applyDuringProbation2,  // ✅ ADDED

      // after confirmation
      afterConfirmPeriod,     // ✅ ADDED
      afterConfirmMax,        // ✅ ADDED

      // s4 usage policy fields
      maxConsecutive4,        // ✅ ADDED
      halfDay4,               // ✅ ADDED
      limitFuture4,           // ✅ ADDED
      futureDuration4,        // ✅ ADDED
      futureApplyAtLeast4,    // ✅ ADDED
      futureNotEarlier4,      // ✅ ADDED
      allowPast4,             // ✅ ADDED
      pastDays4,              // ✅ ADDED

      // s4 sandwich
      sandwiched4,            // ✅ ADDED
      sandwichTypes4,         // ✅ ADDED
      sandwichSubTypes4,      // ✅ ADDED

      // s4 clubbing
      clubbing4,              // ✅ ADDED
      clubbingTypes4,         // ✅ ADDED

      // overutilization
      overutil,
      overutilType,
      deductFrom,

      // carry forward & encashment
      carryForwardEnabled,
      carryFwdLimit,
      carryFwdUnused,
      encashEnabled,
      encashLimit,
      encashUnused,

      // gift a leave
      giftLeave,
      giftLeavesPerYear,
      giftReceive,

      // system
      companyOfficeId,
      status,
    } = req.body;

    // ── REQUIRED CHECK ──────────────────────────────────────────────
    if (!policyName) {
      return res.status(400).json({
        success: false,
        message: "policyName is required",
      });
    }

    // ── RESOLVE OFFICE IDs ──────────────────────────────────────────
    let officeIds = [];
    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    // ── CREATE DOCUMENT ─────────────────────────────────────────────
    const newPolicy = await LeavePolicy.create({
      // BASIC INFO
      policyName,
      description,
      selectedTypes,

      // USAGE POLICY (s2)
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
      sandwichSubTypes,       // ✅ ADDED
      clubbingTypes,

      // HOURLY LEAVE (s3)
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

      // ADVANCED LEAVE CONFIG (s4)
      leaveName4,             // ✅ ADDED

      allocation,
      annualDays,
      gender,
      empType,
      marital,

      calcType4,              // ✅ ADDED
      prorateFrom4,           // ✅ ADDED
      joinCalc4,              // ✅ ADDED
      joinAfterDays4,         // ✅ ADDED
      extProbation4,          // ✅ ADDED
      probCalc4,              // ✅ ADDED
      probAfterDays4,         // ✅ ADDED
      noProRate4,             // ✅ ADDED
      joinsOnOrBefore4,       // ✅ ADDED
      joinsOnOrBeforeDays4,   // ✅ ADDED
      joinsMonth4,            // ✅ ADDED
      elseCalcFrom4,          // ✅ ADDED
      disbursal4,             // ✅ ADDED

      limitProbationCredit,   // ✅ ADDED
      creditUntilProbationSel,// ✅ ADDED
      creditUntilProbationDays,// ✅ ADDED

      attachments,
      attachmentDays,
      attachmentNote,

      maxProbationDays,       // ✅ ADDED
      accumProbation,         // ✅ ADDED
      applyDuringProbation1,  // ✅ ADDED
      applyDuringProbation2,  // ✅ ADDED

      afterConfirmPeriod,     // ✅ ADDED
      afterConfirmMax,        // ✅ ADDED

      maxConsecutive4,        // ✅ ADDED
      halfDay4,               // ✅ ADDED
      limitFuture4,           // ✅ ADDED
      futureDuration4,        // ✅ ADDED
      futureApplyAtLeast4,    // ✅ ADDED
      futureNotEarlier4,      // ✅ ADDED
      allowPast4,             // ✅ ADDED
      pastDays4,              // ✅ ADDED

      sandwiched4,            // ✅ ADDED
      sandwichTypes4,         // ✅ ADDED
      sandwichSubTypes4,      // ✅ ADDED

      clubbing4,              // ✅ ADDED
      clubbingTypes4,         // ✅ ADDED

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