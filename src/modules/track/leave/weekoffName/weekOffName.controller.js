const WeeklyOff = require("./weekOffName.model");

exports.createWeeklyOff = async (req, res) => {
  try {
    const {
      name,
      description,
      grid,
      specifyLastWeek = false,
      lastWeekRow,
      accumulation = false,
      accType,
      refreshAcc,
      refreshType,
      limitCount,
      isDraft = false,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    // if (!grid || !Array.isArray(grid) || grid.length !== 5) {
    //   return res.status(400).json({ message: "Grid must contain 5 weeks" });
    // }

    for (let week of grid) {
      if (!Array.isArray(week) || week.length !== 7) {
        return res.status(400).json({ message: "Each week must contain 7 days" });
      }
    }

    if (specifyLastWeek) {
      if (!lastWeekRow || lastWeekRow.length !== 7) {
        return res.status(400).json({ message: "Last week must contain 7 days" });
      }
    }

    if (!accumulation) {
      if (accType || refreshAcc || refreshType || limitCount) {
        return res.status(400).json({
          message: "Accumulation settings not allowed when accumulation is false",
        });
      }
    }

    if (accumulation) {
      if (!accType) {
        return res.status(400).json({ message: "Accumulation type is required" });
      }

      if (accType === "limited" && (!limitCount || limitCount <= 0)) {
        return res.status(400).json({
          message: "Valid limit count is required for limited accumulation",
        });
      }

      if (refreshAcc) {
        if (!refreshType) {
          return res.status(400).json({
            message: "Refresh type is required when refresh is enabled",
          });
        }
      }
    }

    const weeklyOff = await WeeklyOff.create({
      name: name.trim(),
      description,
      grid,
      specifyLastWeek,
      lastWeekRow: specifyLastWeek ? lastWeekRow : undefined,
      accumulation,
      accType: accumulation ? accType : undefined,
      refreshAcc: accumulation ? refreshAcc : undefined,
      refreshType: accumulation && refreshAcc ? refreshType : undefined,
      limitCount: accType === "limited" ? limitCount : undefined,
      isDraft,
      adminId: req.user?.userId || null,
      companyId:req.user?.companyId
    });

    return res.status(201).json({
      success: true,
      data: weeklyOff,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllWeeklyOff = async (req, res) => {
  try {
    const data = await WeeklyOff.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




// {
//   "name": "Standard Weekly Off",
//   "description": "Saturday Sunday off pattern",
//   "grid": [
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"]
//   ],
//   "specifyLastWeek": false,
//   "accumulation": false,
//   "isDraft": false
// }
// With Last Week Override
// {
//   "name": "Custom Last Week",
//   "description": "Last week different",
//   "grid": [
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"]
//   ],
//   "specifyLastWeek": true,
//   "lastWeekRow": ["full", "full", "full", "full", "off", "off", "off"],
//   "accumulation": false,
//   "isDraft": false
// }
// Accumulation – Unlimited + Monthly Refresh
// {
//   "name": "Accumulation Unlimited",
//   "description": "Unlimited carry forward",
//   "grid": [
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"]
//   ],
//   "specifyLastWeek": false,
//   "accumulation": true,
//   "accType": "unlimited",
//   "refreshAcc": true,
//   "refreshType": "monthly",
//   "isDraft": false
// }
// Accumulation – Limited
// {
//   "name": "Limited Accumulation",
//   "description": "Max 10 carry forward",
//   "grid": [
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"],
//     ["full", "full", "full", "full", "full", "off", "off"]
//   ],
//   "specifyLastWeek": false,
//   "accumulation": true,
//   "accType": "limited",
//   "limitCount": 10,
//   "refreshAcc": false,
//   "isDraft": false
// }