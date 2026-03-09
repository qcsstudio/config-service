const Grade = require("./grade.model");
const populateEmployeeDetails = require("../populateEmployees");


// ✅ 1. CREATE GRADE
exports.createGrade = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId
    const { gradeName,companyOfficeId } = req.body;

    // Optional: Prevent duplicate grade name for same admin
    const existing = await Grade.findOne({ adminId, gradeName });
    if (existing) {
      return res.status(400).json({ message: "Grade already exists" });
    }
    let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    const newGrade = new Grade({
      adminId,
      gradeName,
      companyId,
      companyOfficeId: officeIds,
      addedById: req.user?.userId,
      addedByName: req.user?.name,
      addedByImage: req.user?.image
    });

    await newGrade.save();

    res.status(201).json({
      message: "Grade created successfully",
      data: newGrade
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 2. GET ALL GRADES
exports.getAllGrades = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { country } = req.query;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Base query: match adminId
    let query = { adminId };

    // Fetch grades and populate companyOfficeId
    let grades = await Grade.find(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
      });

    // If country filter applied, remove grades with null companyOfficeId
    if (country) {
      grades = grades.filter(g => g.companyOfficeId !== null);
    }

    const data = await populateEmployeeDetails(grades);

    res.status(200).json({
      message: "Grades fetched successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 3. GET SINGLE GRADE
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({ message: "Grade not found" });
    }

    const data = await populateEmployeeDetails(grade);

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 4. UPDATE GRADE
exports.updateGrade = async (req, res) => {
  try {
    const { gradeName } = req.body;

    const updated = await Grade.findByIdAndUpdate(
      req.params.id,
      { gradeName },
      { new: true }
    );

    const data = await populateEmployeeDetails(updated);

    res.status(200).json({
      message: "Grade updated successfully",
      data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 5. DELETE GRADE
exports.deleteGrade = async (req, res) => {
  try {
    await Grade.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Grade deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 6. ASSIGN EMPLOYEE TO GRADE
// exports.assignEmployeeToGrade = async (req, res) => {
//   try {
//     const gradeId = req.params.id;
//     const employeeData = req.body;

//     const updated = await Grade.findByIdAndUpdate(
//       gradeId,
//       {
//         $push: {
//           assignedEmployeeList: employeeData
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Employee assigned successfully",
//       data: updated
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };



// // ✅ 7. REMOVE EMPLOYEE FROM GRADE
// exports.removeEmployeeFromGrade = async (req, res) => {
//   try {
//     const { employeeid } = req.body;

//     const updated = await Grade.findByIdAndUpdate(
//       req.params.id,
//       {
//         $pull: {
//           assignedEmployeeList: { employeeid }
//         }
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Employee removed successfully",
//       data: updated
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
