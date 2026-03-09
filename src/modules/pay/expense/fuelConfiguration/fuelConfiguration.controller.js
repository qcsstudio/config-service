const FuelConfiguration = require("./fuelConfiguration.model");

exports.createOrUpdateFuelConfiguration = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;
    const {
      petrol,
      diesel,
      electricVehicle,
      cng,
      companyOfficeId,
    } = req.body;

    let fuelConfig = await FuelConfiguration.findOne({ companyId });

    if (fuelConfig) {
      // Update
      fuelConfig.petrol = petrol;
      fuelConfig.diesel = diesel;
      fuelConfig.electricVehicle = electricVehicle;
      fuelConfig.cng = cng;
      fuelConfig.companyOfficeId = companyOfficeId;

      await fuelConfig.save();

      return res.status(200).json({
        success: true,
        message: "Fuel configuration updated successfully",
        data: fuelConfig,
      });
    }

    // Create
    fuelConfig = new FuelConfiguration({
      petrol,
      diesel,
      electricVehicle,
      cng,
      adminId,
      companyId,
      companyOfficeId,
    });

    await fuelConfig.save();

    res.status(201).json({
      success: true,
      message: "Fuel configuration created successfully",
      data: fuelConfig,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getFuelConfigurationByCompany = async (req, res) => {
  try {
  const companyId = req.user?.companyId;

    const fuelConfigs = await FuelConfiguration.find({ companyId })
    res.status(200).json({
      success: true,
      count: fuelConfigs.length,
      data: fuelConfigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};