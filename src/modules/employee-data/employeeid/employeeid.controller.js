const EmployeeIdConfig = require("./employeeId.model");

const createOrUpdateEmployeeIdConfig = async (req, res) => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const configData = req.body;

    let existingConfig = await EmployeeIdConfig.findOne({ adminId });

    if (existingConfig) {
      existingConfig = await EmployeeIdConfig.findOneAndUpdate(
        { adminId },
        configData,
        { new: true }
      );

      return res.status(200).json({
        message: "Employee ID configuration updated successfully",
        data: existingConfig,
      });
    }

    const newConfig = await EmployeeIdConfig.create({
      adminId,
      ...configData,
    });

    res.status(201).json({
      message: "Employee ID configuration created successfully",
      data: newConfig,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEmployeeIdConfig = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "adminId is required" });
    }

    const config = await EmployeeIdConfig.findOne({_id: id });

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


module.exports = {
  createOrUpdateEmployeeIdConfig,
  getEmployeeIdConfig,
};
