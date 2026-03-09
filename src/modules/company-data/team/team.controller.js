const Team = require("./team.model");
const populateEmployeeDetails = require("../populateEmployees");


// ✅ 1. CREATE TEAM
exports.createTeam = async (req, res) => {
  try {
    const adminId = req.user?.userId;
const companyId = req.user?.companyId;
    const {
      teamName,
      assignTeamLead,
      teamLeadId,
      companyOfficeId
    } = req.body;
 let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }
    const newTeam = new Team({
      adminId,
      companyId,
      teamName,
      assignTeamLead,
      teamLeadId: teamLeadId,
      companyOfficeId: officeIds, 
      addedById: req.user?.userId,
      addedByName: req.user?.name,
      addedByImage: req.user?.image
    });

    await newTeam.save();

    res.status(201).json({
      message: "Team created successfully",
      data: newTeam
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 2. GET ALL TEAMS
exports.getAllTeams = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;
    const { country } = req.query;

    if (!adminId) return res.status(401).json({ message: "Unauthorized" });

    let teams = await Team.find({ adminId, companyId }).sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      });

    if (country) teams = teams.filter(t => t.companyOfficeId !== null);

    const data = await populateEmployeeDetails(teams);

    res.status(200).json({
      message: "Teams fetched successfully",
      count: data.length,
      data,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 3. GET SINGLE TEAM
exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const data = await populateEmployeeDetails(team);

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 4. UPDATE TEAM
exports.updateTeam = async (req, res) => {
  try {
    const {
      teamName,
      assignTeamLead,
      teamLeadId
    } = req.body;

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      {
        teamName,
        assignTeamLead,
        teamLeadId
      },
      { new: true }
    );

    res.status(200).json({
      message: "Team updated successfully",
      data: updated
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 5. DELETE TEAM
exports.deleteTeam = async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Team deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// ✅ 6. ASSIGN EMPLOYEE TO TEAM
// exports.assignEmployeeToTeam = async (req, res) => {
//   try {
//     const teamId = req.params.id;
//     const employeeData = req.body;

//     const updated = await Team.findByIdAndUpdate(
//       teamId,
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



// // ✅ 7. REMOVE EMPLOYEE FROM TEAM
// exports.removeEmployeeFromTeam = async (req, res) => {
//   try {
//     const { employeeid } = req.body;

//     const updated = await Team.findByIdAndUpdate(
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



// // ✅ 8. SET / CHANGE TEAM LEAD
// exports.setTeamLead = async (req, res) => {
//   try {
//     const teamId = req.params.id;
//     const teamLeadData = req.body;

//     const updated = await Team.findByIdAndUpdate(
//       teamId,
//       {
//         assignTeamLead: true,
//         teamLead: teamLeadData
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Team lead updated successfully",
//       data: updated
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
