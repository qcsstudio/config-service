const ExpensePolicy = require("./expensePolicy.model");
const populateEmployeeDetails = require("../../../company-data/populateEmployees");

exports.createPolicy = async (req, res) => {
    try {
        const adminId = req.user?.userId;
        const companyId = req.user?.companyId;
        const {
            policyName,
            companyOfficeId,
            description,
            monthlyLimit,

            allowance,
            travel,
            personalVehicle,
            stay,
            skillDevelopment,
            mealsEntertainment,
            utilities,
            officeExpenses,
            commute,

            allowanceLimit,
            allowanceAmount,
            travelLimit,
            travelAmount,
            personalVehicleLimit,
            personalVehicleAmount,
            stayLimit,
            stayAmount,

            trainClass,
            busClass,
            airClass,

            fuelType,
            consumptionType,

            advancePayment,
            maxWithoutReceipt,
            advanceRequest,
            maxAdvance,
            lowerLimit

        } = req.body;

        // ---------- companyOfficeId array check ----------
        let officeIds = [];

        if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
        }

        // ---------- train class ----------
        let trainClasses = [];
        if (trainClass) {
            trainClasses = Array.isArray(trainClass) ? trainClass : [trainClass];
        }

        // ---------- bus class ----------
        let busClasses = [];
        if (busClass) {
            busClasses = Array.isArray(busClass) ? busClass : [busClass];
        }

        // ---------- air class ----------
        let airClasses = [];
        if (airClass) {
            airClasses = Array.isArray(airClass) ? airClass : [airClass];
        }

        // ---------- fuel type ----------
        let fuelTypes = [];
        if (fuelType) {
            fuelTypes = Array.isArray(fuelType) ? fuelType : [fuelType];
        }

        // ---------- consumption type ----------
        let consumptionTypes = [];
        if (consumptionType) {
            consumptionTypes = Array.isArray(consumptionType)
                ? consumptionType
                : [consumptionType];
        }

        const policy = new ExpensePolicy({
            policyName,
            adminId,
            companyId,
            companyOfficeId: officeIds,
            description,
            monthlyLimit,

            categories: {
                allowance,
                travel,
                personalVehicle,
                stay,
                skillDevelopment,
                mealsEntertainment,
                utilities,
                officeExpenses,
                commute
            },

            limits: {
                allowance: {
                    limit: allowanceLimit,
                    amount: allowanceAmount
                },
                travel: {
                    limit: travelLimit,
                    amount: travelAmount
                },
                personalVehicle: {
                    limit: personalVehicleLimit,
                    amount: personalVehicleAmount
                },
                stay: {
                    limit: stayLimit,
                    amount: stayAmount
                }
            },

            travelSettings: {
                trainClass: trainClasses,
                busClass: busClasses,
                airClass: airClasses
            },

            vehicleSettings: {
                fuelType: fuelTypes,
                consumptionType: consumptionTypes
            },

            advanceSettings: {
                advancePayment,
                maxWithoutReceipt,
                advanceRequest,
                maxAdvance,
                lowerLimit
            }

        });

        const savedPolicy = await policy.save();

        res.status(201).json({
            success: true,
            message: "Policy created successfully",
            data: savedPolicy
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.updatePolicy = async (req, res) => {
    try {

        const { id } = req.params;

        const {
            policyName,
            adminId,
            companyId,
            companyOfficeId,
            description,
            monthlyLimit,

            allowance,
            travel,
            personalVehicle,
            stay,
            skillDevelopment,
            mealsEntertainment,
            utilities,
            officeExpenses,
            commute,

            allowanceLimit,
            allowanceAmount,
            travelLimit,
            travelAmount,
            personalVehicleLimit,
            personalVehicleAmount,
            stayLimit,
            stayAmount,

            trainClass,
            busClass,
            airClass,

            fuelType,
            consumptionType,

            advancePayment,
            maxWithoutReceipt,
            advanceRequest,
            maxAdvance,
            lowerLimit

        } = req.body;

        // ---------- companyOfficeId array ----------
        let officeIds;
        if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
        }

        // ---------- trainClass ----------
        let trainClasses;
        if (trainClass) {
            trainClasses = Array.isArray(trainClass) ? trainClass : [trainClass];
        }

        // ---------- busClass ----------
        let busClasses;
        if (busClass) {
            busClasses = Array.isArray(busClass) ? busClass : [busClass];
        }

        // ---------- airClass ----------
        let airClasses;
        if (airClass) {
            airClasses = Array.isArray(airClass) ? airClass : [airClass];
        }

        // ---------- fuelType ----------
        let fuelTypes;
        if (fuelType) {
            fuelTypes = Array.isArray(fuelType) ? fuelType : [fuelType];
        }

        // ---------- consumptionType ----------
        let consumptionTypes;
        if (consumptionType) {
            consumptionTypes = Array.isArray(consumptionType)
                ? consumptionType
                : [consumptionType];
        }

        const updateData = {

            policyName,
            adminId,
            companyId,
            description,
            monthlyLimit,

            categories: {
                allowance,
                travel,
                personalVehicle,
                stay,
                skillDevelopment,
                mealsEntertainment,
                utilities,
                officeExpenses,
                commute
            },

            limits: {
                allowance: {
                    limit: allowanceLimit,
                    amount: allowanceAmount
                },
                travel: {
                    limit: travelLimit,
                    amount: travelAmount
                },
                personalVehicle: {
                    limit: personalVehicleLimit,
                    amount: personalVehicleAmount
                },
                stay: {
                    limit: stayLimit,
                    amount: stayAmount
                }
            },

            travelSettings: {
                trainClass: trainClasses,
                busClass: busClasses,
                airClass: airClasses
            },

            vehicleSettings: {
                fuelType: fuelTypes,
                consumptionType: consumptionTypes
            },

            advanceSettings: {
                advancePayment,
                maxWithoutReceipt,
                advanceRequest,
                maxAdvance,
                lowerLimit
            }

        };

        if (officeIds) {
            updateData.companyOfficeId = officeIds;
        }

        const updatedPolicy = await ExpensePolicy.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedPolicy) {
            return res.status(404).json({
                success: false,
                message: "Policy not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Policy updated successfully",
            data: updatedPolicy
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

// GET SINGLE
exports.getPolicyById = async (req, res) => {
  try {

    const policy = await ExpensePolicy.findById(req.params.id)
      .populate("adminId companyId companyOfficeId");

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    const data = await populateEmployeeDetails(policy);

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


exports.deletePolicy = async (req, res) => {
  try {

    const { id } = req.params;

    const policy = await ExpensePolicy.findByIdAndUpdate(
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

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

exports.getPoliciesByCompany = async (req, res) => {
  try {

    const companyId = req.user?.companyId;

    const policies = await ExpensePolicy.find({
      companyId: companyId,
      isDeleted: false
    })

    const data = await populateEmployeeDetails(policies);

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