const mongoose = require("mongoose");

const AuthoritySchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            default: null,
        },
       employeeId: {
            type: mongoose.Types.ObjectId,
            ref: "Employee",
            default: null,
        },
         employeeName: {
            type: String,
            default: "",
        },
        signatureImage: {
            type: String,
            default: "",
        },
        status:{
            type: Boolean,   
            default: false,
        },      
        companyOfficeId: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "CompanyOffice"
                }
            ],
            default: []
        },
          isDeleted: {
            type: Boolean,
            default: false
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model("AuthoritySignature", AuthoritySchema);