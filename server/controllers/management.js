import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Add affiliateStats as a property on the User object
export const getUserPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    // Mongo DB Aggregate Calls: https://www.mongodb.com/docs/manual/reference/method/db.collection.aggregate/
    // We hit the User Model for its ._id and use it as a foreign key to join the Affiliate table with userId
    const userWithStats = await User.aggregate([
      // https://www.mongodb.com/docs/manual/aggregation/
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      // $unwind: Deconstructs an array field from the input documents to output a document for each element. Each output document is the input document with the value of the array field replaced by the element.
      // https://www.mongodb.com/docs/manual/reference/operator/aggregation/unwind/
      { $unwind: "$affiliateStats" },
    ]);

    // Reach into the the combined object to grab affiliate sales from the original affiliateStats table
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((id) => {
        return Transaction.findById(id);
      })
    );
    // Make sure we dont grab a sale that doesn't have a transaction since our mock data is imperfect
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );

    res
      .status(200)
      .json({ user: userWithStats[0], sales: filteredSaleTransactions });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
