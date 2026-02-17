const router = require("express").Router();
const controller = require("./department.controller");
const auth = require("../../../middlewares/auth.middleware")
router.post("/create-department",auth, controller.createDepartment);
router.get("/all-department", controller.getAllDepartments);
router.get("/all-department/:id", controller.getAllDepartments);
router.put("/update-department/:id", controller.updateDepartment);
router.delete("/delete-department/:id", controller.deleteDepartment);
module.exports = router;