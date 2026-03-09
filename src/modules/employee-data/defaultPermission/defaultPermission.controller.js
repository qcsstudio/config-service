const Feature = require("./feature.model");
const RolePermission = require("./rolePermission.model");
exports.createFeature = async (req, res) => {
  try {

    const { productId, name, tag, description } = req.body;

    // validation
    if (!productId || !name) {
      return res.status(400).json({
        success: false,
        message: "productId and name are required"
      });
    }

    const feature = await Feature.create({
      productId,
      name,
      tag,
      description
    });

    res.status(201).json({
      success: true,
      data: feature
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




exports.upsertRolePermission = async (req, res) => {
  try {

    const companyId = req.user?.companyId;

    // ✅ default role = EMPLOYEE
    const { role = "EMPLOYEE", productId, featureId, actionType } = req.body;

    if (!productId || !featureId) {
      return res.status(400).json({
        success: false,
        message: "productId and featureId are required"
      });
    }

    // 🔎 find existing role permission
    let rolePermission = await RolePermission.findOne({
      companyId,
      role
    });

    // 🟢 If rolePermission does not exist → create new
    if (!rolePermission) {

      rolePermission = await RolePermission.create({
        companyId,
        role,
        permissions: [
          {
            productId,
            featureId,
            actionType
          }
        ]
      });

      return res.status(201).json({
        success: true,
        message: "Permission created",
        data: rolePermission
      });
    }

    // 🔎 Check if feature already exists
    const existingPermission = rolePermission.permissions.find(
      (p) => p.featureId.toString() === featureId
    );

    if (existingPermission) {
      // ✅ update actionType
      existingPermission.actionType = actionType;
    } else {
      // ✅ add new feature permission
      rolePermission.permissions.push({
        productId,
        featureId,
        actionType
      });
    }

    await rolePermission.save();

    res.status(200).json({
      success: true,
      message: "Permission updated",
      data: rolePermission
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};