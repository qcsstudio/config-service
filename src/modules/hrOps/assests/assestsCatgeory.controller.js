const AssetCategory = require("./assestsCatgeory.model");

exports.createAssetCategory = async (req, res) => {
    try {
        const {
            categoryName,
            assetName,
            brand,
            condition,
            description,
            acknowledgement,
            warranty,
            assetType,
            attributes,
            companyOfficeId
        } = req.body;

        let officeIds = [];

        if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
        }

        const assetCategory = new AssetCategory({
            categoryName,
            assetName,
            brand,
            condition,
            description,
            acknowledgement,
            warranty,
            assetType,
            attributes,
            companyOfficeId: officeIds
        });

        await assetCategory.save();

        res.status(201).json({
            success: true,
            message: "Asset Category created successfully",
            data: assetCategory
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllAssetCategories = async (req, res) => {
    try {

        const companyId = req.user?.companyId;
        const categories = await AssetCategory.find({companyId:companyId}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.getOneAssetCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const category = await AssetCategory.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Asset Category not found"
            });
        }

        res.status(200).json({
            success: true,
            data: category
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


exports.updateAssetCategory = async (req, res) => {
    try {


        const { id } = req.params;

        const {
            categoryName,
            assetName,
            brand,
            condition,
            description,
            acknowledgement,
            warranty,
            assetType,
            attributes
        } = req.body;

        const updatedCategory = await AssetCategory.findByIdAndUpdate(
            id,
            {
                categoryName,
                assetName,
                brand,
                condition,
                description,
                acknowledgement,
                warranty,
                assetType,
                attributes
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Asset Category not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Asset Category updated successfully",
            data: updatedCategory
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

