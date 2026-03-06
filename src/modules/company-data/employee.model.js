const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({}, { strict: false, collection: "employees" });

module.exports = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
