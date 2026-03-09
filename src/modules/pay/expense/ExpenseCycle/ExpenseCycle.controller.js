const ExpenseCycle = require("./ExpenseCycle.model");

exports.createExpenseCycle = async (req, res) => {
  try {
    const adminId = req.user?.userId;
    const companyId = req.user?.companyId;

    const {
      companyOfficeId,
      endDate,
      processingDate,
      transitionPeriod,
    } = req.body;

    // 🔹 Convert companyOfficeId to array
    let officeIds = [];

    if (companyOfficeId) {
      officeIds = Array.isArray(companyOfficeId)
        ? companyOfficeId
        : [companyOfficeId];
    }

    // 🔹 Check existing company expense cycle
    let expenseCycle = await ExpenseCycle.findOne({ companyId });

    if (expenseCycle) {

      // 🔹 Update existing
      if (officeIds.length) expenseCycle.companyOfficeId = officeIds;
      if (endDate !== undefined) expenseCycle.endDate = endDate;
      if (processingDate !== undefined) expenseCycle.processingDate = processingDate;
      if (transitionPeriod !== undefined) expenseCycle.transitionPeriod = transitionPeriod;

      await expenseCycle.save();

      return res.status(200).json({
        success: true,
        message: "Expense cycle updated successfully",
        data: expenseCycle,
      });
    }

    // 🔹 Create new
    expenseCycle = await ExpenseCycle.create({
      adminId,
      companyId,
      companyOfficeId: officeIds,
      endDate,
      processingDate,
      transitionPeriod,
    });

    res.status(201).json({
      success: true,
      message: "Expense cycle created successfully",
      data: expenseCycle,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getExpenseCycleByCompany = async (req, res) => {
  try {

    const companyId = req.user?.companyId;

    const data = await ExpenseCycle.find({ companyId })

    res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};