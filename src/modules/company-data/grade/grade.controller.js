const Grade = require("../models/Grade");


// ✅ 1. CREATE GRADE
exports.createGrade = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const { gradeName } = req.body;

    // Optional: Prevent duplicate grade name for same admin
    const existing = await Grade.findOne({ adminId, gradeName });
    if (existing) {
      return res.status(400).json({ message: "Grade already exists" });
    }

    const newGrade = new Grade({
      adminId,
      gradeName,
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

    const grades = await Grade.find()
      .sort({ createdAt: -1 });

    res.status(200).json(grades);

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

    res.status(200).json(grade);

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

    res.status(200).json({
      message: "Grade updated successfully",
      data: updated
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
