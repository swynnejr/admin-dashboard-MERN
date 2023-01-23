import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";

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
