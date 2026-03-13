const AuthoritySignature = require("./Authoritysignture.model");

exports.createAuthoritySignature = async (req, res) => {
    try {
        const { employeeId, companyOfficeId } = req.body;

        const signatureImage = req.file ? req.file.location : "";

        let officeIds = [];

        if (companyOfficeId) {
            officeIds = Array.isArray(companyOfficeId)
                ? companyOfficeId
                : [companyOfficeId];
        }

        const authority = new AuthoritySignature({
            adminId: req.user?.userId,
            companyId: req.user?.companyId,
            employeeId,
            companyOfficeId: officeIds,
            signatureImage,
        });

        await authority.save();

        res.status(201).json({
            success: true,
            message: "Authority Signature created successfully",
            data: authority,
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


exports.getAllAuthoritySignatures = async (req, res) => {
    try {
        const companyId = req.user?.companyId;
        const { country } = req.query;

        let authorities = await AuthoritySignature.find({ companyId, isDeleted: false })
            .populate({
                path: "companyOfficeId",
                match: country ? { "address.country": country } : {},
                select: "locationName address.country address.state address.city",
            })

            .sort({ createdAt: -1 });

        if (country) {
            authorities = authorities.filter(
                (item) => item.companyOfficeId && item.companyOfficeId.length > 0
            );
        }

        res.status(200).json({
            success: true,
            count: authorities.length,
            data: authorities,
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.getOneAuthoritySignature = async (req, res) => {
    try {
        const { id } = req.params;

        const authority = await AuthoritySignature.findOne({
            _id: id,
            isDeleted: false,
        })



        if (!authority) {
            return res.status(404).json({
                success: false,
                message: "Authority Signature not found",
            });
        }

        res.status(200).json({
            success: true,
            data: authority,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.updateAuthoritySignature = async (req, res) => {
  try {
    const { id } = req.params;
    const { employeeId } = req.body;

    // find existing record
    const existingAuthority = await AuthoritySignature.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existingAuthority) {
      return res.status(404).json({
        success: false,
        message: "Authority Signature not found",
      });
    }

    const updateData = {
      employeeId: employeeId || existingAuthority.employeeId,
    };

    // if new image uploaded → update
    if (req.file) {
      updateData.signatureImage = req.file.location;
    } else {
      // keep existing image
      updateData.signatureImage = existingAuthority.signatureImage;
    }

    const authority = await AuthoritySignature.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Authority Signature updated successfully",
      data: authority,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deleteAuthoritySignature = async (req, res) => {
    try {
        const { id } = req.params;

        const authority = await AuthoritySignature.findByIdAndUpdate(
            id,
            { isDelete: true },
            { new: true },
        );

        if (!authority) {
            return res.status(404).json({
                success: false,
                message: "Authority Signature not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Authority Signature deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
