const Employee = require("./employee.model");

async function populateSingleEmployee(docs, sourceKey, targetKey) {
  const isArray = Array.isArray(docs);
  const docArray = isArray ? docs : [docs];
  if (docArray.length === 0) return docs;

  // Collect all unique employee IDs from the given sourceKey
  const employeeIds = [
    ...new Set(
      docArray
        .map((d) => {
          const obj = d.toObject ? d.toObject() : d;
          return obj[sourceKey]?.toString();
        })
        .filter(Boolean)
    ),
  ];

  if (employeeIds.length === 0) return isArray ? docArray : docArray[0];

  // Fetch matching employees
  const employees = await Employee.find(
    { _id: { $in: employeeIds } },
    "fullName firstName lastName phone workEmail employeeId systemRole"
  ).lean();

  // Build map: mongoId → details
  const empMap = new Map();
  employees.forEach((e) => {
    empMap.set(e._id.toString(), {
      employeeName:
        e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim(),
      phone: e.phone || "",
      workEmail: e.workEmail || "",
      employeeCode: e.employeeId || "",
      systemRole:e.systemRole || ""
    });
  });

  // Attach details under targetKey on each doc
  const result = docArray.map((d) => {
    const obj = d.toObject ? d.toObject() : { ...d };
    const empId = obj[sourceKey]?.toString();
    obj[targetKey] = empMap.get(empId) || null; // ← saved under your chosen key
    return obj;
  });

  return isArray ? result : result[0];
}
module.exports = populateSingleEmployee