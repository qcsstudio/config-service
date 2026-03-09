const express = require("express");
const router = express.Router();

const {
  createCurrency,
  getAllCurrencies,
  updateCurrency,
  getCurrencyById
} = require("./Currency.controller");

// Create Currency
router.post("/create-currency", createCurrency);

// Get All Currencies
router.get("/all-currency", getAllCurrencies);

// Get Currency By ID
router.get("/getOne-currency/:id", getCurrencyById);

// Update Currency
router.put("/update/currency/:id", updateCurrency);

module.exports = router;