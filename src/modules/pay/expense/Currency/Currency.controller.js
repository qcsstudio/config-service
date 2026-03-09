const Currency = require("./Currency.model");

const createCurrency = async (req, res) => {
    try {

        const { currency, conversionRate, adminId, companyId, companyOfficeId } = req.body;

        let officeIds = [];

        if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
        }

        // Currency Symbol Map
        const currencySymbols = {
            USD: "$",
            INR: "₹",
            EUR: "€",
            GBP: "£",
            JPY: "¥",
            CAD: "C$",
            AUD: "A$",
            PKR: "₨",
            CNY: "¥"
        };

        const symbol = currencySymbols[currency] || "";

        const newCurrency = new Currency({
            currency,
            symbol,   // auto set symbol
            conversionRate,
            adminId,
            companyId,
            companyOfficeId: officeIds
        });

        const savedCurrency = await newCurrency.save();

        res.status(201).json({
            success: true,
            data: savedCurrency
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getAllCurrencies = async (req, res) => {

    try {
        const companyId = req.user?.companyId;
        const { country } = req.query;

        let filter = {};

        if (companyId) {
            filter.companyId = companyId;
        }

        const currencies = await Currency.find(filter)

            .populate({
                path: "companyOfficeId",
                match: country ? { "address.country": country } : {},
                select: "locationName address.country address.state address.city",
            })

            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: currencies.length,
            data: currencies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const updateCurrency = async (req, res) => {
    try {

        const { id } = req.params;

        // Destructure only the fields you want to update
        const { currency, conversionRate } = req.body;
        const currencySymbols = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥", CAD: "C$", AUD: "A$", PKR: "₨", CNY: "¥" };
        const symbol = currencySymbols[currency] || "";
        const updateData = {
            currency,
            symbol,
            conversionRate,
            updatedAt: new Date()
        };

        const updatedCurrency = await Currency.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            data: updatedCurrency
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCurrencyById = async (req, res) => {
    try {

        const { id } = req.params;


        const currency = await Currency.findOne({
            _id: id,
        })


        if (!currency) {
            return res.status(404).json({
                success: false,
                message: "Currency not found"
            });
        }

        res.status(200).json({
            success: true,
            data: currency
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

module.exports = {
    createCurrency,
    getAllCurrencies,
    updateCurrency,
    getCurrencyById
};