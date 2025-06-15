import Lead from "../models/Lead.js";
import CommunicationLog from "../models/CommunicationLog.js";
import Booking from "../models/Booking.js";

export const getLeadStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const newToday = await Lead.countDocuments({
      created_date: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    });

    const converted = await Lead.countDocuments({ status: "converted" });
    const conversionRate = total ? Math.round((converted / total) * 100) : 0;

    res.json({
      total,
      newToday,
      converted,
      conversion: conversionRate,
      changePercentage: 18,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getLeadSources = async (req, res) => {
  try {
    const sources = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
    ]);

    const total = sources.reduce((sum, source) => sum + source.value, 0);
    const result = sources.map((source) => ({
      ...source,
      percentage: `${Math.round((source.value / total) * 100)}%`,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getLeadStatus = async (req, res) => {
  try {
    const statusData = await Lead.aggregate([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
    ]);

    res.json(statusData);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getLeadTrends = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const matchStage = {};
    if (fromDate && toDate) {
      matchStage.created_date = {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      };
    }

    const trends = await Lead.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            year: { $year: "$created_date" },
            month: { $month: "$created_date" },
          },
          totalLeads: { $sum: 1 },
          convertedLeads: {
            $sum: {
              $cond: [{ $eq: ["$status", "converted"] }, 1, 0],
            },
          },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: 1,
                },
              },
            },
          },
          totalLeads: 1,
          convertedLeads: 1,
          remainingLeads: {
            $subtract: ["$totalLeads", "$convertedLeads"],
          },
        },
      },
    ]);

    res.json(trends);
  } catch (error) {
    console.error("Error fetching lead trends:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getPackagePopularity = async (req, res) => {
  try {
    const popularPackages = await Booking.aggregate([
      { $group: { _id: "$package_id", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "packages",
          localField: "_id",
          foreignField: "_id",
          as: "package",
        },
      },
      { $unwind: "$package" },
      {
        $project: {
          name: "$package.title",
          value: "$count",
          _id: 0,
        },
      },
    ]);

    if (popularPackages.length === 0) {
      return res.json([]);
    }

    const total = popularPackages.reduce((sum, pkg) => sum + pkg.value, 0);
    const result = popularPackages.map((pkg) => ({
      ...pkg,
      percentage: total ? `${Math.round((pkg.value / total) * 100)}%` : "0%",
    }));

    res.json(result);
  } catch (error) {
    console.error("Error fetching package popularity:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getCommunicationMethods = async (req, res) => {
  try {
    const methods = await CommunicationLog.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $project: { name: "$_id", value: "$count", _id: 0 } },
    ]);

    res.json(methods);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
