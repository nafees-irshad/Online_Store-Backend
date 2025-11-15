/** @format */

const Wishlist = require("../models/wishlistModel");
const Product = require("../models/productsModel");

const UpdateWishList = async (req, resp) => {
  const { productId, action } = req.body;
  const userId = "68bfd7118a615ffa9789ff8a";

  try {
    // Fetch Product
    const product = await Product.findById(productId);
    if (!product || product.qty <= 0) {
      return resp.status(404).json({ message: "Product out of stock" });
    }

    // Fetch wishlist
    const wishlist = await Wishlist.findOne({ userId });

    // Add items to wishlist
    if (action === "add") {
      if (!wishlist) {
        // Create a new wishlist if it doesn't exist
        const newWishList = new Wishlist({
          userId,
          products: [productId], // Initialize with the productId
        });
        await newWishList.save();
      } else {
        // Check if the product is already in the wishlist
        if (wishlist.products.includes(productId)) {
          return resp
            .status(200)
            .json({ message: "Product already in wishlist" });
        }
        // Add the product to the wishlist
        wishlist.products.push(productId);
        await wishlist.save();
      }
      return resp
        .status(200)
        .json({ message: "Added to Wishlist Successfully" });
    }

    // Remove item from wishlist
    if (action === "remove") {
      if (!wishlist) {
        return resp.status(404).json({ message: "Wishlist not found" });
      }
      // Remove the product from the wishlist
      wishlist.products.pull(productId);
      await wishlist.save();
      return resp.status(200).json({
        message: "Item removed from Wishlist Successfully",
        wishlist,
      });
    }

    // If action is neither 'add' nor 'remove'
    return resp.status(400).json({ message: "Invalid action" });
  } catch (err) {
    console.log(err);
    return resp.status(500).json({ message: "Internal server error" });
  }
};

//view wishlist
const viewWishList = async (req, resp) => {
  const userId = "68bfd7118a615ffa9789ff8a";
  // Get the user ID from the middleware

  try {
    // Fetch the wishlist by ID
    const wishList = await Wishlist.findOne({ userId }).populate(
      "products",
      "name price"
    );

    // Check if the wishlist exists
    if (!wishList) {
      return resp.status(200).json({
        status: "fail",
        message: "Wishlist not found",
      });
    }

    // Verify that the wishlist belongs to the logged-in user
    if (wishList.userId.toString() !== userId.toString()) {
      return resp
        .status(403)
        .json({ message: "You are not authorized to view this wishlist" });
    }

    // Return the wishlist data
    resp.status(200).json({
      status: "success",
      wishlist: wishList,
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "Internal server error" });
  }
};

//delete wishlist
const deleteWishList = async (req, resp) => {
  const userId = req.user.id; // Get the user ID from the middleware
  try {
    const wishList = await Wishlist.findOneAndDelete({ userId });
    if (!wishList) {
      return resp.status(404).json({ message: "Wishlist not found" });
    }
    resp.status(200).json({
      status: "success",
      message: "wishlist removed",
    });
  } catch (err) {
    console.log(err);
    resp.status(500).json({ message: "internal error" });
  }
};
module.exports = { UpdateWishList, viewWishList, deleteWishList };
