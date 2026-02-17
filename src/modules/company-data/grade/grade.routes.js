const express = require("express");
const router = express.Router();
const controller = require("./grade.controller");
const auth = require("../../../middlewares/auth.middleware")
// CRUD
router.post("/create-grade",auth, controller.createGrade);
router.get("/getAll-grade", controller.getAllGrades);
router.get("/getOne-grade/:id", controller.getGradeById);
router.put("/update-grade/:id", controller.updateGrade);
router.delete("/delete-grade/:id", controller.deleteGrade);