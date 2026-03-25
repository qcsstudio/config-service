const HolidayPlan = require("./holidayPolicy.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

/* ─────────────────────────────────────────────
   CREATE HOLIDAY PLAN
───────────────────────────────────────────── */
exports.createHolidayPlan = async (req, res) => {
  try {

    const {
      // Step 1 — Describe
      name,
      description,

      // Step 2 — Preferences
      year,
      mandatoryHolidays,
      optionalHolidays,

      // Step 3 — Plan (calendar holidays array)
      holidays,

      // Step 4 — Mandatory holiday date rules
      existingEmployeeDate,
      sendEmailExisting,
      newEmployeeDays,
      sendEmailNew,

      // Step 4 — Optional holiday date rules
      existingOptionalDate,
      sendEmailExistingOptional,
      newOptionalDays,
      sendEmailNewOptional,
      maxOptionalHolidays,

      // System
      status,
      companyOfficeId,
    } = req.body;

    const companyId = req.user?.companyId;
    const adminId   = req.user?.userId;
console.log(companyId,"ddddd")
    // Required field validation
    if (!name || !year) {
      return res.status(400).json({
        success: false,
        message: "Name and Year are required",
      });
    }

    // Duplicate check
    const existingPlan = await HolidayPlan.findOne({
      companyId,
      year: Number(year),
    });

    // if (existingPlan) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Holiday plan already exists for this year",
    //   });
    // }

    // Conditional validation — optional holidays
    if (optionalHolidays === "yes" && !maxOptionalHolidays) {
      return res.status(400).json({
        success: false,
        message: "Max optional holidays is required when optional holidays are enabled",
      });
    }

    // Normalize companyOfficeId to array
    let officeIds = [];
    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const holidayPlan = await HolidayPlan.create({
      // Step 1
      name: name.trim(),
      description,

      // Step 2
      year: Number(year),
      mandatoryHolidays,
      optionalHolidays,

      // Step 3
      holidays: holidays || [],

      // Step 4 — Mandatory
      existingEmployeeDate:     existingEmployeeDate     || null,
      sendEmailExisting:        sendEmailExisting        ?? true,
      newEmployeeDays:          newEmployeeDays          || null,
      sendEmailNew:             sendEmailNew             ?? true,

      // Step 4 — Optional
      existingOptionalDate:     existingOptionalDate     || null,
      sendEmailExistingOptional: sendEmailExistingOptional ?? true,
      newOptionalDays:          newOptionalDays          || null,
      sendEmailNewOptional:     sendEmailNewOptional     ?? true,
      maxOptionalHolidays:      maxOptionalHolidays      || null,

      // System
      status:          status || "draft",
      companyId,
      adminId,
      companyOfficeId: officeIds,
    });

    return res.status(201).json({
      success: true,
      message: "Holiday Plan created successfully",
      data: holidayPlan,
    });

  } catch (error) {

    console.error("Create Holiday Plan Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/* ─────────────────────────────────────────────
   GET ALL HOLIDAY PLANS
───────────────────────────────────────────── */
exports.getAllHolidayPlans = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const {
      page = 1,
      limit = 10,
      search,
      status,
      year,
    } = req.query;
//  const query = {};
    const query = { companyId };

    // 🔎 Search by name
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // 🔎 Filter by status
    if (status) {
      query.status = status;
    }

    // 🔎 Filter by year
    if (year) {
      query.year = Number(year);
    }

    const total = await HolidayPlan.countDocuments(query);

    const plans = await HolidayPlan.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const data = await populateEmployeeDetails(plans);

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data,
    });
  } catch (error) {
    console.error("Get Holiday Plans Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.getHolidayPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    // const companyId = req.user.companyId;

    const holidayPlan = await HolidayPlan.findOne({
      _id: id,
      // companyId,
    });

    if (!holidayPlan) {
      return res.status(404).json({
        success: false,
        message: "Holiday Plan not found",
      });
    }

    const data = await populateEmployeeDetails(holidayPlan);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Get Holiday Plan By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.deleteHolidayPlan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Holiday Plan ID is required",
      });
    }

    const holidayPlan = await HolidayPlan.findOneAndDelete({
      _id: id,
    });

    if (!holidayPlan) {
      return res.status(404).json({
        success: false,
        message: "Holiday Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Holiday Plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete Holiday Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
exports.updateHolidayPlan = async (req, res) => {
  try {
    const { id } = req.params;
    // const companyId = req.user.companyId;

    const {
      name,
      description,
      year,
      mandatoryHolidays,
      optionalHolidays,
      existingEmployeeDate,
      sendEmailExisting,
      newEmployeeDays,
      sendEmailNew,
      maxOptionalHolidays,
      approvalRequired,
      approver,
      notifyApprover,
      status,
    } = req.body;

    const holidayPlan = await HolidayPlan.findOneAndUpdate(
      { _id: id },
      {
        name,
        description,
        year,
        mandatoryHolidays,
        optionalHolidays,
        existingEmployeeDate,
        sendEmailExisting,
        newEmployeeDays,
        sendEmailNew,
        maxOptionalHolidays,
        approvalRequired,
        approver,
        notifyApprover,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!holidayPlan) {
      return res.status(404).json({
        success: false,
        message: "Holiday Plan not found",
      });
    }

    const data = await populateEmployeeDetails(holidayPlan);

    return res.status(200).json({
      success: true,
      message: "Holiday Plan updated successfully",
      data,
    });
  } catch (error) {
    console.error("Update Holiday Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



// {
//   "name": "2026 Holiday Plan",
//   "description": "Company holiday plan",
//   "year": 2026,
//   "mandatoryHolidays": "yes",
//   "optionalHolidays": "yes",
//   "existingEmployeeDate": "2026-01-01",
//   "sendEmailExisting": true,
//   "newEmployeeDays": 30,
//   "sendEmailNew": true,
//   "maxOptionalHolidays": 5,
//   "approvalRequired": "yes",
//   "approver": "manager",
//   "notifyApprover": "yes",
//   "status": "draft"
// }