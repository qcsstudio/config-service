const mongoose = require("mongoose");
const { Schema } = mongoose;

/* ── Hours + Minutes pair ───────────────────────────── */
const HMSchema = new Schema(
  {
    hours: { type: Number, default: null },
    minutes: { type: Number, default: null },
  },
  { _id: false }
);

/* ── Duration ───────────────────────────────────────── */
const DurationSchema = new Schema(
  {
    mode: { type: String, default: null },
    percent: { type: Number, default: null },
    time: { type: HMSchema, default: () => ({}) },
  },
  { _id: false }
);

/* ── Penalty block ─────────────────────────────────── */
const PenaltyBlockSchema = new Schema(
  {
    enabled: { type: String, default: null },
    leaveType: { type: String, default: null },
    leavesToDeduct: { type: String, default: null },
    leavesToDeductPerLateDay: { type: String, default: null },
    deductionPolicy: { type: String, default: null },
  },
  { _id: false }
);

/* ── STEP 2 — WORK REQUEST ─────────────────────────── */
const WorkRequestSchema = new Schema(
  {
    wfhOdType: { type: String, default: null },
    wfhMaxRequestsPerMonth: { type: Number, default: null },
    backupMaxRequestsPerMonth: { type: Number, default: null },
    restrictAttendanceRequests: { type: Boolean, default: false },
    restrictedRequestsCount: { type: Number, default: null },
  },
  { _id: false }
);

/* ── STEP 3 — ABSENTEEISM ─────────────────────────── */
const AbsenteeismSchema = new Schema(
  {
    autoActionsEnabled: { type: Boolean, default: true },
    noShowHandling: { type: String, default: null },
    leaveSubAction: { type: String, default: null },
    absentLeaveType: { type: String, default: null },
    absentLeavesToDeduct: { type: String, default: null },
  },
  { _id: false }
);

/* ── STEP 4 — PUNCTUALITY ─────────────────────────── */
const GraceHoursSchema = new Schema(
  {
    monthlyGrace: { type: HMSchema, default: () => ({}) },
    triggerAfter: { type: HMSchema, default: () => ({}) },
    maxAllowed: { type: HMSchema, default: () => ({}) },
    penaltyType: { type: String, default: null },
    penalty: { type: PenaltyBlockSchema, default: () => ({}) },
  },
  { _id: false }
);

const GraceCountsSchema = new Schema(
  {
    graceCountsPerMonth: { type: Number, default: null },
    triggerAfter: { type: HMSchema, default: () => ({}) },
    maxAllowed: { type: HMSchema, default: () => ({}) },
    usageCount: { type: Number, default: null },
    penaltyType: { type: String, default: null },
    penalty: { type: PenaltyBlockSchema, default: () => ({}) },
  },
  { _id: false }
);

const PunctualitySchema = new Schema(
  {
    trackLateComers: { type: Boolean, default: true },
    lateMarkTrackingType: { type: String, default: null },
    graceHours: { type: GraceHoursSchema, default: () => ({}) },
    graceCounts: { type: GraceCountsSchema, default: () => ({}) },
  },
  { _id: false }
);

/* ── STEP 5 — TIME AT WORK ─────────────────────────── */
const TimeAtWorkSchema = new Schema(
  {
    requirementEnabled: { type: String, default: null },

    halfDay: {
      minDuration: { type: DurationSchema, default: () => ({}) },
      penalty: { type: PenaltyBlockSchema, default: () => ({}) },
    },

    fullDay: {
      minDuration: { type: DurationSchema, default: () => ({}) },
      penalty: { type: PenaltyBlockSchema, default: () => ({}) },
    },

    weekly: {
      requiredHours: { type: HMSchema, default: () => ({}) },
      penalty: { type: PenaltyBlockSchema, default: () => ({}) },
    },
  },
  { _id: false }
);

/* ── ASSIGNED EMPLOYEE ─────────────────────────────── */
const AssignedEmployeeSchema = new Schema(
  {
    employeeid: { type: Number, default: null },
    employeename: { type: String, default: "" },
    employeecode: { type: String, default: "" },
    emailid: { type: String, default: "" },
    primarymobile: { type: String, default: "" },
    designationid: { type: Number, default: null },
    designationname: { type: String, default: "" },
    imagepath: { type: String, default: "" },
    probationperiodid: { type: Number, default: null },
  },
  { _id: false }
);

/* ── ROOT ─────────────────────────────────────────── */
const AttendancePolicySchema = new Schema(
  {
    policyName: { type: String, required: true, trim: true },
    policyDescription: { type: String, default: "" },

    workRequest: { type: WorkRequestSchema, default: () => ({}) },
    absenteeism: { type: AbsenteeismSchema, default: () => ({}) },
    punctuality: { type: PunctualitySchema, default: () => ({}) },
    timeAtWork: { type: TimeAtWorkSchema, default: () => ({}) },

    addedByName: { type: String, default: "" },
    addedByImage: { type: String, default: "" },

    assignedEmployeeList: {
      type: [AssignedEmployeeSchema],
      default: [],
    },

    status: { type: String, default: "draft" },

    adminId: { type: Schema.Types.ObjectId, default: null },
    updatedBy: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: true, versionKey: false }
);

AttendancePolicySchema.index({ policyName: 1 }, { unique: true });
AttendancePolicySchema.index({ status: 1 });
AttendancePolicySchema.index({ createdAt: -1 });

const AttendancePolicy = mongoose.model(
  "AttendancePolicy",
  AttendancePolicySchema
);

module.exports = AttendancePolicy;