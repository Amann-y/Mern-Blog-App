const express = require("express");
const { addProductController, getProductsController,deleteProductByIdController,getProductById,filterByCategory, updateProductByIdController,exportProductsCSV  } = require("../controllers/productController");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

// private routes
router.post("/add-product", authMiddleware, addProductController);
router.get("/get-products", authMiddleware,  getProductsController);
router.delete("/delete-product/:id", authMiddleware, deleteProductByIdController );
router.get("/get-single-product/:id", authMiddleware, getProductById  );
router.get("/filter-by-category/:categoryOrName", authMiddleware, filterByCategory );
router.put("/update-product/:id", authMiddleware, updateProductByIdController)
router.get("/productsexport", authMiddleware,exportProductsCSV)


module.exports = router;
