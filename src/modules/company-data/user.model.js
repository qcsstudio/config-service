const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({}, { strict: false, collection: "users" });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
