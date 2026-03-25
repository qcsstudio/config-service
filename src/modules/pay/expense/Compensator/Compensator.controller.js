const CompensatorConfiguration = require("./Compensator.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");
const populateSingleEmployee = require("../../../company-data/populateSingleEmployee");


// CREATE
exports.createCompensatorConfiguration = async (req, res) => {
  try {

    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const { businessUnitId, departmentId, locationId, employeeId } = req.body;

   

    const businessUnits = Array.isArray(businessUnitId)
      ? businessUnitId
      : businessUnitId
      ? [businessUnitId]
      : [];

    const departments = Array.isArray(departmentId)
      ? departmentId
      : departmentId
      ? [departmentId]
      : [];

    const locations = Array.isArray(locationId)
      ? locationId
      : locationId
      ? [locationId]
      : [];

    const data = new CompensatorConfiguration({
      adminId,
      companyId,
      businessUnitId: businessUnits,
      departmentId: departments,
      locationId: locations,
       employeeId: employeeId
    });

    const savedData = await data.save();

    res.status(201).json({
      success: true,
      message: "Configuration created successfully",
      data: savedData
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// GET ALL
exports.getAllCompensatorConfiguration = async (req, res) => {
  try {
    const companyId = req.user?.companyId;
    const configs = await CompensatorConfiguration.find({ isDeleted: false, companyId: companyId })
      .populate("businessUnitId")
      .populate("departmentId")
      .populate("locationId");

    // Reads from "employeeId" field, saves populated details into "employeeDetails"
    const data = await populateSingleEmployee(configs, "employeeId", "employeeDetails");

    res.status(200).json({
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


// GET ONE
exports.getCompensatorConfigurationById = async (req, res) => {
  try {

    const { id } = req.params;

    const config = await CompensatorConfiguration.findById(id)
      .populate("companyId")
      .populate("businessUnitId")
      .populate("departmentId")
      .populate("locationId");

    if (!config) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found"
      });
    }

    const data = await populateEmployeeDetails(config);

    res.status(200).json({
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


// UPDATE
exports.updateCompensatorConfiguration = async (req, res) => {
  try {

    const { id } = req.params;

    const { businessUnitId, departmentId, locationId, employeeId } = req.body;

    const businessUnits = Array.isArray(businessUnitId)
      ? businessUnitId
      : businessUnitId
      ? [businessUnitId]
      : [];

    const departments = Array.isArray(departmentId)
      ? departmentId
      : departmentId
      ? [departmentId]
      : [];

    const locations = Array.isArray(locationId)
      ? locationId
      : locationId
      ? [locationId]
      : [];

    

    const updatedData = await CompensatorConfiguration.findByIdAndUpdate(
      id,
      {
        businessUnitId: businessUnits,
        departmentId: departments,
        locationId: locations,
         employeeId: employeeId
      },
      { new: true }
    );

    const data = await populateEmployeeDetails(updatedData);

    res.status(200).json({
      success: true,
      message: "Configuration updated successfully",
      data
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// DELETE
exports.deleteCompensatorConfiguration = async (req, res) => {
  try {

   const { id } = req.params;
   
       const policy = await CompensatorConfiguration.findByIdAndUpdate(
         id,
         { isDeleted: true },
         { new: true }
       );
   
       if (!policy) {
         return res.status(404).json({
           success: false,
           message: "Policy not found"
         });
       }
   
       res.status(200).json({
         success: true,
         message: "Policy soft deleted successfully",
         data: policy
       });
   
     }  catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};