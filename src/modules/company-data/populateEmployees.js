const Employee = require("./employee.model");
const User = require("./user.model");

async function populateEmployeeDetails(docs) {
  const isArray = Array.isArray(docs);
  const docArray = isArray ? docs : [docs];
  if (docArray.length === 0) return docs;

  // Collect all unique employee IDs
  const employeeIds = [
    ...new Set(
      docArray.flatMap((d) => {
        const obj = d.toObject ? d.toObject() : d;
        return (obj.assignedEmployeeList || [])
          .map((e) => e.employeeId?.toString())
          .filter(Boolean);
      })
    ),
  ];

  // Collect all unique admin IDs
  const adminIds = [
    ...new Set(
      docArray
        .map((d) => {
          const obj = d.toObject ? d.toObject() : d;
          return obj.adminId?.toString();
        })
        .filter(Boolean)
    ),
  ];

  // Parallel queries — employees + admins
  const [employees, admins] = await Promise.all([
    employeeIds.length > 0
      ? Employee.find(
          { _id: { $in: employeeIds } },
          "fullName firstName lastName phone workEmail employeeId"
        ).lean()
      : [],
    adminIds.length > 0
      ? User.find(
          { _id: { $in: adminIds } },
          "name email _id"
        ).lean()
      : [],
  ]);

  const empMap = new Map();
  employees.forEach((e) => {
    empMap.set(e._id.toString(), {
      employeeName: e.fullName || `${e.firstName || ""} ${e.lastName || ""}`.trim(),
      phone: e.phone || "",
      workEmail: e.workEmail || "",
      employeeCode: e.employeeId || "",
    });
  });

  const adminMap = new Map();
  admins.forEach((a) => {
    adminMap.set(a._id.toString(), {
      adminName: a.name || "",
      adminEmail: a.email || "",
    });
  });

  // Map employee details + admin details into response
  const result = docArray.map((d) => {
    const obj = d.toObject ? d.toObject() : { ...d };

    // Add admin details
    const adminInfo = adminMap.get(obj.adminId?.toString()) || null;
    if (adminInfo) {
      obj.adminName = adminInfo.adminName;
      obj.adminEmail = adminInfo.adminEmail;
    }

    // Map employee details into assignedEmployeeList
    obj.assignedEmployeeList = (obj.assignedEmployeeList || []).map((item) => {
      const empId = item.employeeId?.toString();
      const details = empMap.get(empId) || null;
      return {
        _id: item._id,                    // mongoose auto-generated id
        visibleEmployeeId: item.employeeId, // actual employee reference id
        departmentId: item.departmentId,
        ...(details || {}),                // employeeName, phone, workEmail, employeeCode
      };
    });
    return obj;
  });

  return isArray ? result : result[0];
}



module.exports = populateEmployeeDetails;
