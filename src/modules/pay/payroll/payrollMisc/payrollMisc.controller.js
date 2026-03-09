const PayrollMisc = require("./payrollMisc.model");

exports.createPayrollMiscSettings = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    if (!adminId || !companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // =====================================================
    // 🔹 DESTRUCTURE FLAT BODY
    // =====================================================

    const {
      roundingOption,
      variableDashboardDaysBeforeRun,
      allowVPF,

      // FBP
      RunPayrollenabled,
      earlyPayrollRun,
      variableDashboardDays,
      fbpCutOffDay,
      paidEveryMonth,
      billSubmissionEnabled,
      taxableBalancing,
      carryForwardUnused,

      // Salary Slip
      logoPlacement,
      bodyLayout,
      showEmployeeDeduction,
      showEmployerDeduction,
      showBankDetails,
      salaryCutOffDay,
      showBusinessAddress,
      showBusinessLogo,
      digitalSignature,
      none,

      // Loan
      loanEnabled,
      probationConfirmation,
      loanShowEmployerDeduction,
      loanShowBankDetails,
      SetCuffOffDay,
      UponProbationConfirmation,
      eligibilityDaysAfterJoining,
      allowDuringNoticePeriod,
      minimumPackageAmount,
      minimumPackageType,
      loanLimitType,
      loanLimitValue,
      maxInstallments,
      defaultInterestRate,
      interestMethod,

      // IT Declaration
      existingFrom,
      existingTo,
      newEmployeesDaysAfterJoining,
      requireApproval,
      allowMidYearChange,
      effectiveFrom,
      effectiveTo,
      requireEffectiveApproval,

      // IT Submission
      standardFrom,
      standardTo,
      extendedFrom,
      extendedTo,
      requireProof,
      allowTaxRegimeChange,
      taxRegimeChangeDaysOpen,
    } = req.body;

    // =====================================================
    // 🔹 CREATE DOCUMENT WITH NESTED STRUCTURE
    // =====================================================

    const settings = await PayrollMisc.create({
      adminId,
      companyId,

      roundingOption,
      variableDashboardDaysBeforeRun,
      allowVPF,

      fbp: {
        RunPayrollenabled,
        earlyPayrollRun,
        variableDashboardDays,
        cutOffDay: fbpCutOffDay,
        paidEveryMonth,
        billSubmission: {
          billSubmissionEnabled,
          taxableBalancing,
          carryForwardUnused,
        },
      },

      salarySlip: {
        logoPlacement,
        bodyLayout,
        showEmployeeDeduction,
        showEmployerDeduction,
        showBankDetails,
        cutOffDay: salaryCutOffDay,
        showBusinessAddress,
        showBusinessLogo,
        signingAuthority: {
          digitalSignature,
          none,
        },
      },

      loanSettings: {
        loanEnabled,
        eligibilityType: {
          probationConfirmation,
          showEmployerDeduction: loanShowEmployerDeduction,
          showBankDetails: loanShowBankDetails,
        },
        SetCuffOffDay,
        UponProbationConfirmation,
        eligibilityDaysAfterJoining,
        allowDuringNoticePeriod,
        minimumPackageAmount,
        minimumPackageType,
        loanLimitType,
        loanLimitValue,
        maxInstallments,
        defaultInterestRate,
        interestMethod,
      },

      itDeclaration: {
        existingEmployeesWindow: {
          from: existingFrom,
          to: existingTo,
        },
        newEmployeesDaysAfterJoining,
        requireApproval,
        allowMidYearChange,
        effectiveWindow: {
          from: effectiveFrom,
          to: effectiveTo,
        },
        requireEffectiveApproval,
      },

      itSubmission: {
        standardWindow: {
          from: standardFrom,
          to: standardTo,
        },
        extendedWindow: {
          from: extendedFrom,
          to: extendedTo,
        },
        requireProof,
        allowTaxRegimeChange,
        taxRegimeChangeDaysOpen,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Payroll Misc Settings Created Successfully",
      data: settings,
    });

  } catch (error) {
    console.error("Create Payroll Misc Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


// {
//   "roundingOption": "two-decimal",
//   "variableDashboardDaysBeforeRun": 5,
//   "allowVPF": true,

//   "RunPayrollenabled": true,
//   "earlyPayrollRun": false,
//   "variableDashboardDays": 3,
//   "fbpCutOffDay": 25,
//   "paidEveryMonth": false,
//   "billSubmissionEnabled": true,
//   "taxableBalancing": true,
//   "carryForwardUnused": false,

//   "logoPlacement": true,
//   "bodyLayout": true,
//   "showEmployeeDeduction": true,
//   "showEmployerDeduction": true,
//   "showBankDetails": true,
//   "salaryCutOffDay": 28,
//   "showBusinessAddress": true,
//   "showBusinessLogo": true,
//   "digitalSignature": true,
//   "none": false,

//   "loanEnabled": true,
//   "probationConfirmation": true,
//   "loanShowEmployerDeduction": false,
//   "loanShowBankDetails": false,
//   "SetCuffOffDay": "15",
//   "UponProbationConfirmation": true,
//   "eligibilityDaysAfterJoining": 90,
//   "allowDuringNoticePeriod": true,
//   "minimumPackageAmount": 50000,
//   "minimumPackageType": "annual",
//   "loanLimitType": "percentage",
//   "loanLimitValue": 50,
//   "maxInstallments": 12,
//   "defaultInterestRate": 10,
//   "interestMethod": "Reducing interest rate",

//   "existingFrom": "2026-04-01",
//   "existingTo": "2026-04-30",
//   "newEmployeesDaysAfterJoining": 30,
//   "requireApproval": true,
//   "allowMidYearChange": true,
//   "effectiveFrom": "2026-05-01",
//   "effectiveTo": "2026-05-31",
//   "requireEffectiveApproval": true,

//   "standardFrom": "2026-12-01",
//   "standardTo": "2026-12-31",
//   "extendedFrom": "2027-01-01",
//   "extendedTo": "2027-01-15",
//   "requireProof": true,
//   "allowTaxRegimeChange": true,
//   "taxRegimeChangeDaysOpen": 15
// }

exports.getAllPayrollMiscSettings = async (req, res) => {
  try {
    
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const settings = await PayrollMisc.find({ companyId });

    return res.status(200).json({
      success: true,
      count: settings.length,
      data: settings,
    });

  } catch (error) {
    console.error("Get All Payroll Misc Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};