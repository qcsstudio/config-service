const express = require("express");
const router = express.Router();

const holidayPlanController = require("./holidayPolicy.controller");
const auth = require("../../../../middlewares/auth.middleware");

/* ─────────────────────────────────────────────
   CREATE HOLIDAY PLAN
   POST /api/holiday-plan
───────────────────────────────────────────── */
router.post(
  "/create/holidayplan",
  auth,
  holidayPlanController.createHolidayPlan
);

/* ─────────────────────────────────────────────
   GET ALL HOLIDAY PLANS
   GET /api/holiday-plan
   ?page=1&limit=10&search=&status=&year=
───────────────────────────────────────────── */
router.get(
  "/getAll/holidayPlan",
  holidayPlanController.getAllHolidayPlans
);

/* ─────────────────────────────────────────────
   GET SINGLE HOLIDAY PLAN
   GET /api/holiday-plan/:id
───────────────────────────────────────────── */
router.get(
  "/getOne/holidayPlan/:id",
  holidayPlanController.getHolidayPlanById
);

/* ─────────────────────────────────────────────
   UPDATE HOLIDAY PLAN
   PUT /api/holiday-plan/:id
───────────────────────────────────────────── */
router.put(
  "/update/holidayPlan/:id",
  holidayPlanController.updateHolidayPlan
);


module.exports = router;