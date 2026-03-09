const PayrollComponent = require("./payrollComponent.model");

// ✅ Create Payroll Component (Destructured)
exports.createPayrollComponent = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;
    const {

      componentName,
      componentCode,
      useReadymade,
      readymadeComponent,

      Income,
      employeeDeduction,
      employerDeduction,
      CTC,
      Non_Ctc,
      isVariable,
      isExtraPayment,
      isTaxable,
      taxGroup,
      willAccrue,

      recoverExtraDeduction,
      isStatutory,
      isStatutoryDeduction,
      journalVoucher,
      isActive,
      companyOfficeId
    } = req.body;
    let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    // ✅ Create new component
    const newComponent = new PayrollComponent({
      adminId,
      companyId,
      componentName,
      componentCode,
      useReadymade,
      readymadeComponent,

      Income,
      employeeDeduction,
      employerDeduction,
      CTC,
      Non_Ctc,
      isVariable,
      isExtraPayment,
      isTaxable,
      taxGroup,
      willAccrue,

      recoverExtraDeduction,
      isStatutory,
      isStatutoryDeduction,
      journalVoucher,
      isActive,
      companyOfficeId: officeIds,
    });

    await newComponent.save();

    return res.status(201).json({
      success: true,
      message: "Payroll component created successfully",
      data: newComponent,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllPayrollComponents = async (req, res) => {
  try {
    // ✅ Get companyId properly
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Company not found.",
      });
    }

    // ✅ Get country from query
    const { country } = req.query;

    // ✅ Base filter
    const filter = {
      companyId,
      isActive: true,
    };

    // ✅ Fetch components
    let components = await PayrollComponent.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "companyOfficeId",
        match: country ? { "address.country": country } : {},
        select: "locationName address.country address.state address.city",
      });

    // ✅ If country provided → remove unmatched populated records
    if (country) {
      components = components.filter(
        (comp) => comp.companyOfficeId !== null
      );
    }

    return res.status(200).json({
      success: true,
      count: components.length,
      data: components,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};