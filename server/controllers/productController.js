const { ProductSchema } = require("../models/productSchema");
const { UserSchema } = require("../models/userSchema");
const csv = require("fast-csv");
const fs = require("fs");

const addProductController = async (req, res) => {
  try {
    const { name, price, category, company } = req.body;
    const { _id } = req.user;

    if (!name || !price || !category || !company) {
      return res.status(401).send({ error: "All Fields Are Required" });
    }

    const userInfo = await UserSchema.findById(_id).select("-password");

    const newProduct = await ProductSchema.create({
      name,
      price,
      category,
      company,
      userid: _id,
      userInfo,
    });

    const populatedProduct = await ProductSchema.findById(newProduct._id)
      .populate({
        path: "userid",
        select: "-password", // Exclude the password field
      })
      .exec();

    res.status(200).send({
      message: "New Product Added",
      newProduct: populatedProduct,
      userInfo,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getProductsController = async (req, res) => {
  try {
    const { name, email, createdAt, updatedAt } = req.user;

    const products = await ProductSchema.find({});

    if (!products) {
      return res.status(401).send({ error: "No Product Found" });
    }

    return res
      .status(200)
      .send({ products, email, name, createdAt, updatedAt });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const output = await ProductSchema.findByIdAndDelete(id);

    return res
      .status(200)
      .send({ message: "The Product Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(401)
        .send({ error: "No Product Id Found, Please Provide Product Id" });
    }

    const output = await ProductSchema.findById(id);
    if (!output) {
      return res.status(401).send({ error: "No Product Found With This Id" });
    }
    return res.status(200).send({ output });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const filterByCategory = async (req, res) => {
  try {
    const { categoryOrName } = req.params;

    const output = await ProductSchema.find({
      $or: [
        { name: { $regex: new RegExp(categoryOrName, "i") } }, // Case-insensitive search for name
        { category: { $regex: new RegExp(categoryOrName, "i") } }, // Case-insensitive search for category
      ],
    });

    if (!output || output.length === 0) {
      return res.status(404).send({ error: "No Products Found" });
    }

    return res.status(200).send({ output });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const updateProductByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ error: "Please Provide Product Id" });
    }
    let output = await ProductSchema.updateOne({ _id: id }, { $set: req.body });
    return res.status(200).send({ output });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const exportProductsCSV = async (req, res) => {
  try {
    const products = await ProductSchema.find();
    const csvStream = csv.format({ headers: true });

    // Ensure the directory structure exists
    await fs.promises.mkdir("public/files/", { recursive: true });
    await fs.promises.mkdir("public/files/export", { recursive: true });

    const writeableStream = fs.createWriteStream(
      "public/files/export/products.csv"
    );

    csvStream.pipe(writeableStream);

    writeableStream.on("finish", () => {
      res.json({
        downloadUrl: `${req.protocol}://${req.get(
          "host"
        )}/files/export/products.csv`,
      });
    });

    if (products.length > 0) {
      await Promise.all(
        products.map(async (ele) => {
          const userData = await UserSchema.findById(ele.userid);
          await csvStream.write({
            name: ele.name ?? "-",
            price: ele.price ?? "-",
            category: ele.category ?? "-",
            company: ele.company ?? "-",
            uploadBy: userData && userData.email ? userData.email : "-",
          });
        })
      );
    }

    csvStream.end();
    writeableStream.end();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
};

module.exports = {
  addProductController,
  getProductsController,
  deleteProductByIdController,
  getProductById,
  filterByCategory,
  updateProductByIdController,
  exportProductsCSV,
};
