const CompensatorConfiguration = require("./Compensator.model");

// CREATE
exports.createCompensatorConfiguration = async (req, res) => {
  try {

    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const { businessUnitId, departmentId, locationId } = req.body;

   

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
      locationId: locations
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
    const data = await CompensatorConfiguration.find({isDeleted:false,companyId:companyId})
      .populate("businessUnitId")
      .populate("departmentId")
      .populate("locationId");

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

    const data = await CompensatorConfiguration.findById(id)
      .populate("assignedEmployeeList.employeeId")
      .populate("adminId")
      .populate("companyId")
      .populate("businessUnitId")
      .populate("departmentId")
      .populate("locationId");

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Configuration not found"
      });
    }

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

    const { businessUnitId, departmentId, locationId } = req.body;

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
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Configuration updated successfully",
      data: updatedData
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