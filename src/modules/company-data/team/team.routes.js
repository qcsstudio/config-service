const express = require("express");
const router = express.Router();
const controller = require("./team.controller");
const auth = require("../../../middlewares/auth.middleware")
// CRUD
router.post("/create-team",auth, controller.createTeam);
router.get("/getAll-team", controller.getAllTeams);
router.get("/getOne-team/:id", controller.getTeamById);
router.put("/update-team/:id", controller.updateTeam);
router.delete("/delete-team/:id", controller.deleteTeam);