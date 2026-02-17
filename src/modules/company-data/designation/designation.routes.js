const express = require("express");
const router = express.Router();
const controller = require("./designation.controller");
const auth = require("../../../middlewares/auth.middleware")
// CRUD
router.post("/create-designation",auth, controller.createDesignation);
router.get("/getAll-designation", controller.getAllDesignations);
router.get("/getOne-designation/:id", controller.getDesignationById);
router.put("/update-designation/:id", controller.updateDesignation);
router.delete("/delete-designation/:id", controller.deleteDesignation);