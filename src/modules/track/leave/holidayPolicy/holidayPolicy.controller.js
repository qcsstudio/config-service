const HolidayPlan = require("./holidayPolicy.model");

/* ─────────────────────────────────────────────
   CREATE HOLIDAY PLAN
───────────────────────────────────────────── */
exports.createHolidayPlan = async (req, res) => {
  try {
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

    const companyId = req.user?.companyId; // from auth middleware
const adminId = req.user?.userId
    // Basic validation
    if (!name || !year) {
      return res.status(400).json({
        success: false,
        message: "Name and Year are required",
      });
    }

    const holidayPlan = await HolidayPlan.create({
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
      companyId,
      adminId,
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
      message: "Server Error",
    });
  }
};


/* ─────────────────────────────────────────────
   GET ALL HOLIDAY PLANS
───────────────────────────────────────────── */
exports.getAllHolidayPlans = async (req, res) => {
  try {
    // const companyId = req.user.companyId;

    const {
      page = 1,
      limit = 10,
      search,
      status,
      year,
    } = req.query;

    // const query = { companyId };

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

    return res.status(200).json({
      success: true,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      data: plans,
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
    const companyId = req.user.companyId;

    const holidayPlan = await HolidayPlan.findOne({
      _id: id,
      companyId,
    });

    if (!holidayPlan) {
      return res.status(404).json({
        success: false,
        message: "Holiday Plan not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: holidayPlan,
    });
  } catch (error) {
    console.error("Get Holiday Plan By ID Error:", error);
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

    return res.status(200).json({
      success: true,
      message: "Holiday Plan updated successfully",
      data: holidayPlan,
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