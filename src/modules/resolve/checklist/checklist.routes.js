const router = require("express").Router();
const checklistController = require("./checklist.controller");
const auth = require("../../../middlewares/auth.middleware");
router.post("/createChecklist",auth, checklistController.createChecklist);

router.post("/addActivity/:checklistId", checklistController.addActivity);

router.get("/getActivities/:checklistId", checklistController.getActivities);

router.put("/updateActivity/:checklistId/:activityId", checklistController.updateActivity);

router.delete("/deleteActivity/:checklistId/:activityId", checklistController.deleteActivity);

router.post("/assignEmployee/:checklistId", checklistController.assignEmployee);

router.get("/getAllChecklists",auth, checklistController.getAllChecklists);

router.get("/getOneChecklist/:checklistId", checklistController.getOneChecklist);

router.put("/updateChecklist/:checklistId", checklistController.updateChecklist);

router.delete("/deleteChecklist/:checklistId", checklistController.deleteChecklist);

module.exports = router;