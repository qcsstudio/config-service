const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/database");

const BusinessUnit = require("./modules/company-data/businessUnit/businessUnit.model");
const Department = require("./modules/company-data/department/department.model");
const Designation = require("./modules/company-data/designation/designation.model");
const Grade = require("./modules/company-data/grade/grade.model");
const Team = require("./modules/company-data/team/team.model");

const ADMIN_ID = new mongoose.Types.ObjectId("69a19f5305082ae34743f522");
const COMPANY_ID = new mongoose.Types.ObjectId("69a19ee605082ae34743f519");

// Real Employee IDs from employees collection
const EMP1 = new mongoose.Types.ObjectId("6980bfcadf2faecc9a0b0918"); // Rahul Sharma
const EMP2 = new mongoose.Types.ObjectId("6980bfcadf2faecc9a0b0919"); // Anita Verma
const EMP3 = new mongoose.Types.ObjectId("6980bfcadf2faecc9a0b091a"); // Suresh Kumar
const EMP4 = new mongoose.Types.ObjectId("6980bfcadf2faecc9a0b091b"); // Pooja Singh
const EMP5 = new mongoose.Types.ObjectId("6980bfcadf2faecc9a0b091c"); // Amit Patel
const EMP6 = new mongoose.Types.ObjectId("6981f2e40df8a0e75eccb0bf"); // John Doe
const EMP7 = new mongoose.Types.ObjectId("698300aeb5202bdcbc15fc7a"); // Varun Verma
const EMP8 = new mongoose.Types.ObjectId("698300e3b5202bdcbc15fc83"); // Varun Verma

async function seed() {
  await connectDB();
  console.log("Connected to DB. Seeding dummy data...\n");

  // ========== 1. Business Units ==========
  const businessUnits = await BusinessUnit.insertMany([
    {
      adminId: ADMIN_ID,
      businessUnitName: "Technology Division",
      locationName: "Mumbai HQ",
      companyOfficeId: [COMPANY_ID],
      location: { type: "Point", coordinates: [72.8777, 19.076] },
      logo: "",
      assignBusinessHead: true,
      businessHead: "Rahul Sharma",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP1, departmentId: null },
        { employeeId: EMP2, departmentId: null },
        { employeeId: EMP7, departmentId: null },
      ],
    },
    {
      adminId: ADMIN_ID,
      businessUnitName: "Sales & Marketing",
      locationName: "Delhi Office",
      companyOfficeId: [COMPANY_ID],
      location: { type: "Point", coordinates: [77.209, 28.6139] },
      logo: "",
      assignBusinessHead: true,
      businessHead: "Priya Verma",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP5, departmentId: null },
        { employeeId: EMP6, departmentId: null },
      ],
    },
    {
      adminId: ADMIN_ID,
      businessUnitName: "Operations Unit",
      locationName: "Bangalore Office",
      companyOfficeId: [COMPANY_ID],
      location: { type: "Point", coordinates: [77.5946, 12.9716] },
      logo: "",
      assignBusinessHead: false,
      businessHead: "",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP3, departmentId: null },
        { employeeId: EMP8, departmentId: null },
      ],
    },
  ]);
  console.log(`✅ ${businessUnits.length} Business Units created`);

  // ========== 2. Departments ==========
  const departments = await Department.insertMany([
    {
      adminId: ADMIN_ID,
      departmentName: "Engineering",
      companyOfficeId: [COMPANY_ID],
      isPartOfBusinessUnit: true,
      businessUnitId: businessUnits[0]._id,
      isSubDepartment: false,
      parentDepartmentName: null,
      assignDepartmentHead: true,
      departmentheadId: EMP1,
      departmentHead: "Amit Kumar",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP1 },
        { employeeId: EMP2 },
        { employeeId: EMP7 },
      ],
    },
    {
      adminId: ADMIN_ID,
      departmentName: "Human Resources",
      companyOfficeId: [COMPANY_ID],
      isPartOfBusinessUnit: false,
      businessUnitId: null,
      isSubDepartment: false,
      parentDepartmentName: null,
      assignDepartmentHead: true,
      departmentheadId: EMP3,
      departmentHead: "Sneha Patel",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP3 },
        { employeeId: EMP4 },
      ],
    },
    {
      adminId: ADMIN_ID,
      departmentName: "Finance",
      companyOfficeId: [COMPANY_ID],
      isPartOfBusinessUnit: false,
      businessUnitId: null,
      isSubDepartment: false,
      parentDepartmentName: null,
      assignDepartmentHead: true,
      departmentheadId: EMP4,
      departmentHead: "Vikram Singh",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP4 },
        { employeeId: EMP8 },
      ],
    },
    {
      adminId: ADMIN_ID,
      departmentName: "Digital Marketing",
      companyOfficeId: [COMPANY_ID],
      isPartOfBusinessUnit: true,
      businessUnitId: businessUnits[1]._id,
      isSubDepartment: false,
      parentDepartmentName: null,
      assignDepartmentHead: false,
      departmentheadId: null,
      departmentHead: null,
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP5 },
        { employeeId: EMP6 },
      ],
    },
    {
      adminId: ADMIN_ID,
      departmentName: "QA & Testing",
      companyOfficeId: [COMPANY_ID],
      isPartOfBusinessUnit: true,
      businessUnitId: businessUnits[0]._id,
      isSubDepartment: true,
      parentDepartmentName: "Engineering",
      assignDepartmentHead: false,
      departmentheadId: null,
      departmentHead: null,
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP7 },
        { employeeId: EMP8 },
      ],
    },
  ]);
  console.log(`✅ ${departments.length} Departments created`);

  // ========== 3. Designations ==========
  const designations = await Designation.insertMany([
    {
      adminId: ADMIN_ID,
      designationName: "Software Engineer",
      companyOfficeId: [COMPANY_ID],
      isPartOfDepartment: true,
      departmentId: departments[0]._id,
      departmentName: "Engineering",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP1, departmentId: departments[0]._id },
        { employeeId: EMP2, departmentId: departments[0]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      designationName: "Senior Software Engineer",
      companyOfficeId: [COMPANY_ID],
      isPartOfDepartment: true,
      departmentId: departments[0]._id,
      departmentName: "Engineering",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP7, departmentId: departments[0]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      designationName: "HR Manager",
      companyOfficeId: [COMPANY_ID],
      isPartOfDepartment: true,
      departmentId: departments[1]._id,
      departmentName: "Human Resources",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP3, departmentId: departments[1]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      designationName: "Finance Analyst",
      companyOfficeId: [COMPANY_ID],
      isPartOfDepartment: true,
      departmentId: departments[2]._id,
      departmentName: "Finance",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP4, departmentId: departments[2]._id },
        { employeeId: EMP8, departmentId: departments[2]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      designationName: "Marketing Executive",
      companyOfficeId: [COMPANY_ID],
      isPartOfDepartment: true,
      departmentId: departments[3]._id,
      departmentName: "Digital Marketing",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP5, departmentId: departments[3]._id },
        { employeeId: EMP6, departmentId: departments[3]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      designationName: "QA Tester",
      companyOfficeId: [COMPANY_ID],
      isPartOfDepartment: true,
      departmentId: departments[4]._id,
      departmentName: "QA & Testing",
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP7, departmentId: departments[4]._id },
        { employeeId: EMP8, departmentId: departments[4]._id },
      ],
    },
  ]);
  console.log(`✅ ${designations.length} Designations created`);

  // ========== 4. Grades ==========
  const grades = await Grade.insertMany([
    {
      adminId: ADMIN_ID,
      gradeName: "G1 - Entry Level",
      companyOfficeId: [COMPANY_ID],
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP1, departmentId: departments[0]._id },
        { employeeId: EMP5, departmentId: departments[3]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      gradeName: "G2 - Junior",
      companyOfficeId: [COMPANY_ID],
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP2, departmentId: departments[0]._id },
        { employeeId: EMP6, departmentId: departments[3]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      gradeName: "G3 - Mid Level",
      companyOfficeId: [COMPANY_ID],
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP7, departmentId: departments[0]._id },
        { employeeId: EMP8, departmentId: departments[2]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      gradeName: "G4 - Senior",
      companyOfficeId: [COMPANY_ID],
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP3, departmentId: departments[1]._id },
        { employeeId: EMP4, departmentId: departments[2]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      gradeName: "G5 - Lead / Manager",
      companyOfficeId: [COMPANY_ID],
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP1, departmentId: departments[0]._id },
        { employeeId: EMP3, departmentId: departments[1]._id },
      ],
    },
  ]);
  console.log(`✅ ${grades.length} Grades created`);

  // ========== 5. Teams ==========
  const teams = await Team.insertMany([
    {
      adminId: ADMIN_ID,
      teamName: "Backend Team",
      companyOfficeId: [COMPANY_ID],
      assignTeamLead: true,
      teamLeadId: EMP1,
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP1, departmentId: departments[0]._id },
        { employeeId: EMP2, departmentId: departments[0]._id },
        { employeeId: EMP7, departmentId: departments[0]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      teamName: "Frontend Team",
      companyOfficeId: [COMPANY_ID],
      assignTeamLead: true,
      teamLeadId: EMP2,
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP2, departmentId: departments[0]._id },
        { employeeId: EMP5, departmentId: departments[3]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      teamName: "DevOps Team",
      companyOfficeId: [COMPANY_ID],
      assignTeamLead: false,
      teamLeadId: null,
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP7, departmentId: departments[4]._id },
        { employeeId: EMP8, departmentId: departments[4]._id },
      ],
    },
    {
      adminId: ADMIN_ID,
      teamName: "Sales Team",
      companyOfficeId: [COMPANY_ID],
      assignTeamLead: true,
      teamLeadId: EMP6,
      addedById: ADMIN_ID,
      addedByName: "Admin User",
      addedByImage: "",
      assignedEmployeeList: [
        { employeeId: EMP5, departmentId: departments[3]._id },
        { employeeId: EMP6, departmentId: departments[3]._id },
      ],
    },
  ]);
  console.log(`✅ ${teams.length} Teams created`);

  console.log("\n🎉 All dummy data seeded successfully!");
  console.log(`   adminId:  ${ADMIN_ID}`);
  console.log(`   companyId (used as companyOfficeId): ${COMPANY_ID}`);
  console.log(`\n   Dummy Employee IDs used:`);
  console.log(`   EMP1: ${EMP1}`);
  console.log(`   EMP2: ${EMP2}`);
  console.log(`   EMP3: ${EMP3}`);
  console.log(`   EMP4: ${EMP4}`);
  console.log(`   EMP5: ${EMP5}`);
  console.log(`   EMP6: ${EMP6}`);
  console.log(`   EMP7: ${EMP7}`);
  console.log(`   EMP8: ${EMP8}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
