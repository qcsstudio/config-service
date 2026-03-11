const EmployeeIdConfig = require("./employeeId.model");
const axios = require("axios");
const BusinessUnitModel = require("../../company-data/businessUnit/businessUnit.model");
const CompanyOfficeModel = require("../../accountmanagement/company-office/company.model");
const  DepartmentModel = require("../../company-data/department/department.model");
const createOrUpdateEmployeeIdConfig = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Admin not found."
      });
    }

    const {
      assignType,
      preview,
      assignToExistingEmployees,
      includeDeactivatedEmployees,
      continueSeriesForFutureEmployees
    } = req.body;

    let existingConfig = await EmployeeIdConfig.findOne({ companyId });

    // UPDATE
    if (existingConfig) {
      existingConfig = await EmployeeIdConfig.findOneAndUpdate(
        { companyId },
        {
          assignType,
          preview,
          assignToExistingEmployees,
          includeDeactivatedEmployees,
          continueSeriesForFutureEmployees
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Employee ID configuration updated successfully",
        data: existingConfig
      });
    }

    // CREATE
    const newConfig = await EmployeeIdConfig.create({
      adminId,
      companyId,
      assignType,
      preview,
      assignToExistingEmployees,
      includeDeactivatedEmployees,
      continueSeriesForFutureEmployees
    });

    return res.status(201).json({
      success: true,
      message: "Employee ID configuration created successfully",
      data: newConfig
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// {
//   "assignType": "automatic",
//   "preview": "EMP-001",
//   "assignToExistingEmployees": true,
//   "includeDeactivatedEmployees": false,
//   "continueSeriesForFutureEmployees": true
// }

const getEmployeeIdConfig = async (req, res) => {
  try {
    const companyId = req.user?.companyId;

    const config = await EmployeeIdConfig.findOne({companyId: companyId });

    if (!config) {
      return res.status(404).json({
        message: "Employee ID configuration not found",
      });
    }

    res.status(200).json({
      message: "Employee ID configuration fetched successfully",
      data: config,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const gettext = async (req, res) => {
  try {
    console.log(req.user, "req.userreq.user");

    const companyId = req.user?.companyId;
    console.log(companyId, "companyIdcompanyId");

    const { type } = req.query;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "CompanyId not found"
      });
    }

    let data = {};

    switch (type) {

      case "Companyname": {

        const response = await axios.get(
          `http://localhost:4000/users/company-get/${companyId}`
        );

        data = response?.data?.data?.slug || "";
        break;
      }

      case "Businessunitname": {

        const result = await BusinessUnitModel.findOne(
          { companyId },
          { businessUnitName: 1 }
        );

        data = result?.businessUnitName || "";
        break;
      }

      case "officelocationname": {

        const result = await CompanyOfficeModel.findOne(
          { companyId },
          { "address.city": 1 }
        );
      console.log(result, "resultresultresult");
        data = result?.address?.city || "";
        break;
      }

      case "Departmentname": {

        const result = await DepartmentModel.findOne(
          { companyId },
          { departmentName: 1 }
        );
        data = result?.departmentName || "";
        break;
      }

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid type"
        });
    }

    return res.status(200).json({
      success: true,
      type,
      data
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


module.exports = {
  createOrUpdateEmployeeIdConfig,
  getEmployeeIdConfig,
  gettext
};
