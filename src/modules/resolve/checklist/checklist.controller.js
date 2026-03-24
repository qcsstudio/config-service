const Checklist = require("./checklist.model");

exports.createChecklist = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      checkType,
      title,
      description,
      purpose,
      businessUnit,
      department,
      designation,
      team,
      location,
    //   assignedEmployees,
    //   activities
    } = req.body;

    /* ================= CHECKLIST TYPE ================= */

    let checklistType = "";

    if (checkType == 1) {
      checklistType = "Automatic";
    } else if (checkType == 2) {
      checklistType = "Manual";
    }

    /* ================= CONVERT TO ARRAY ================= */

    const convertArray = (data) => {
      if (!data) return [];
      return Array.isArray(data) ? data : [data];
    };

    const checklist = await Checklist.create({
      adminId,
      companyId,
      checkType,
      checklistType,
      title,
      description,
      purpose,

      businessUnit: convertArray(businessUnit),
      department: convertArray(department),
      designation: convertArray(designation),
      team: convertArray(team),
      location: convertArray(location),

    //   assignedEmployees: convertArray(assignedEmployees),

    //   activities: convertArray(activities),
    });

    res.status(201).json({
      success: true,
      message: "Checklist created successfully",
      data: checklist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ACTIVITY CONCEPT - Each checklist can have multiple activities.
exports.addActivity = async (req, res) => {
  try {

    const { checklistId } = req.params;
    const activity = req.body;

    const checklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        $push: { activities: activity }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Activity added",
      data: checklist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getActivities = async (req, res) => {
  try {

    const { checklistId } = req.params;

    const checklist = await Checklist.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found"
      });
    }

    const activities = checklist.activities.filter(
      (act) => act.deleted !== true
    );

    res.json({
      success: true,
      data: activities
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.updateActivity = async (req, res) => {
  try {

    const { checklistId, activityId } = req.params;

    const updateData = req.body;

    const updateFields = {};

    if (updateData.type) updateFields["activities.$.type"] = updateData.type;
    if (updateData.title) updateFields["activities.$.title"] = updateData.title;
    if (updateData.description) updateFields["activities.$.description"] = updateData.description;
    if (updateData.dueDays) updateFields["activities.$.dueDays"] = updateData.dueDays;
    if (updateData.file) updateFields["activities.$.file"] = updateData.file;
    if (updateData.link) updateFields["activities.$.link"] = updateData.link;

    const checklist = await Checklist.findOneAndUpdate(
      {
        _id: checklistId,
        "activities._id": activityId
      },
      {
        $set: updateFields
      },
      { new: true }
    );

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist or Activity not found"
      });
    }

    res.json({
      success: true,
      message: "Activity updated successfully",
      data: checklist
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.deleteActivity = async (req, res) => {
  try {

    const { checklistId, activityId } = req.params;

    const checklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        $pull: { activities: { _id: activityId } }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Activity removed",
      data: checklist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.assignEmployee = async (req, res) => {
  try {
    const { checklistId } = req.params;

    let employeeIds = req.body.employeeId;

    // ✅ convert to array if single
    if (!Array.isArray(employeeIds)) {
      employeeIds = [employeeIds];
    }

    // ✅ map employees
    const employeesToAdd = employeeIds.map(id => ({
      employeeId: id,
      assignedDate: new Date()
    }));

    const checklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        $addToSet: {
          assignedEmployees: { $each: employeesToAdd } // 🔥 important
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Employees assigned",
      data: checklist
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// END POINT OF ACTIVITY MANAGEMENT


// Get all checklists for the company with populated references
exports.getAllChecklists = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const { status } = req.query;

    let filter = { companyId };

    // ✅ apply status only if provided
    if (status !== undefined) {
      filter.status = status === "true";
    }

    const data = await Checklist.find(filter)
      .populate("businessUnit department designation team location assignedEmployees.employeeId")
      .sort({ createdAt: -1 });

    res.json({
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
 // Get single checklist by ID with populated references
exports.getOneChecklist = async (req, res) => {
  try {

    const { checklistId } = req.params;

    const checklist = await Checklist.findById(checklistId)
      .populate("businessUnit")
      .populate("department")
      .populate("designation")
      .populate("team")
      .populate("location")
      .populate("assignedEmployees.employeeId");

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found"
      });
    }

    // Optional: remove soft deleted activities
    const activeActivities = checklist.activities.filter(
      (act) => act.deleted !== true
    );

    const data = {
      ...checklist.toObject(),
      activities: activeActivities
    };

    res.json({
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
// Update checklist details and add new references (businessUnit, department, etc.)
exports.updateChecklist = async (req, res) => {
  try {

    const { checklistId } = req.params;

    const {
      title,
      description,
      purpose,
      businessUnit,
      department,
      designation,
      team,
      location,
      assignedEmployees,
    } = req.body;

    /* ===== ARRAY CONVERTER ===== */

    const toArray = (data) => {
      if (!data) return [];
      return Array.isArray(data) ? data : [data];
    };

    /* ===== UPDATE DATA ===== */

    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (purpose) updateData.purpose = purpose;

    /* ===== UPDATE QUERY ===== */

    const checklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        $set: updateData,

        $addToSet: {
          businessUnit: { $each: toArray(businessUnit) },
          department: { $each: toArray(department) },
          designation: { $each: toArray(designation) },
          team: { $each: toArray(team) },
          location: { $each: toArray(location) },
          assignedEmployees: { $each: toArray(assignedEmployees) },
        }

      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Checklist updated successfully",
      data: checklist
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// Soft delete checklist by setting isDeleted to true
exports.deleteChecklist = async (req, res) => {
  try {

    const { checklistId } = req.params;

    const checklist = await Checklist.findByIdAndUpdate(
      checklistId,
      {
        $set: { isDeleted: true }
      },
      { new: true }
    );

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found"
      });
    }

    res.json({
      success: true,
      message: "Checklist deleted successfully",
      data: checklist
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.updateChecklistStatus = async (req, res) => {
  try {
    const { checklistId } = req.params;
    const { status } = req.query; // 👈 from body (better than query)

    // ✅ validate
    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Status must be true or false",
      });
    }

    const checklist = await Checklist.findOneAndUpdate(
      {
        _id: checklistId,
        companyId: req.user.companyId, // 🔐 secure
      },
      {
        $set: { isDeleted: status },
      },
      { new: true }
    );

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Checklist ${status ? "deleted" : "restored"} successfully`,
      data: checklist,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};