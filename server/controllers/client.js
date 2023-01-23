import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    const productsWithStats = await Promise.all(
      // Call API for EACH product to get the stats
      products.map(async (product) => {
        const stat = await ProductStat.find({
          // productId is the foreign key on ProductStat table that pairs up with Product._id
          productId: product._id,
        });
        // Take each Product Object and combine it with the Product Stat Properties coming from this API call
        return {
          ...product._doc,
          stat,
        };
      })
    );

    res.status(200).json(productsWithStats);
    // TO DO: Make error feedback more robust
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Client Side Pagination - This sends ALL customers
export const getCustomers = async (req, res) => {
  try {
    // .select("-password") removes the password from the user object when it gets sent to front end
    const customers = await User.find({ role: "user" }).select("-password");
    res.status(200).json(customers);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Server Side Pagination - Only requests chunks of transactions at a time
export const getTransactions = async (req, res) => {
  try {
    // sort field from Data Grid will look like this: { "field": "userId", "sort": "desc"}
    const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

    // Format what comes in from Material UI Data Grid into what MongoDB wants to receive
    // formatted sort should look like { userId: -1 }
    const generateSort = () => {
      // Since we are receiving a string from MUI, we need to change it to an object from Mongo
      const sortParsed = JSON.parse(sort);
      const sortFormatted = {
        // MongoDB wants 1 for ASC, and -1 for DESC
        [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
      };

      return sortFormatted;
    };
    const sortFormatted = Boolean(sort) ? generateSort() : {};

    const transactions = await Transaction.find({
      // $or allows for searching various fields
      $or: [
        { cost: { $regex: new RegExp(search, "i") } },
        { userId: { $regex: new RegExp(search, "i") } },
      ],
    })
      .sort(sortFormatted)
      // Offset/Limit Pagination
      .skip(page * pageSize)
      .limit(pageSize);

    const total = await Transaction.countDocuments({
      name: { $regex: search, $options: "i" },
    });

    res.status(200).json({
      transactions,
      total,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
