const productModel = require("../models/product.model");
const fs = require("fs")

module.exports = {
  
  listProduct: async (req, res) => {
    try {
      const products = await productModel.find();
      return res.status(200).json({
        status: 200,
        products: products,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting product",
      });
    }
  },

  listProductById: async (req, res) => {
    const id = req.params.id;
    try {
      const product = await productModel.findOne({ _id: id });
      if (!product) {
        return res.status(404).json({
          status: 404,
          message: "No such product",
        });
      }
      return res.status(201).json({
        status: 201,
        product: product,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting product",
      });
    }
  },

  createProduct: async (req, res) => {
    console.log(req.body);
    
    if(!req.file){
      return res.status(500).json({
        status: 500,
        message: " Product image is required",
        // error: error,
      });
    }
    // const Product = JSON.parse(req.body.product)
    // delete Product._id;
    var product = new productModel({
      ...req.body,
      image : `${req.protocol}://${req.get("host")}/images/products/${req.file.filename}`
    });
    try {
      await product.save();
      return res.status(202).json({
        status: 202,
        message: "Product added succesfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: " error adding the product",
        error: error,
      });
    }
  },

  updateProduct: async (req, res) => {
    const id = req.params.id;
    try {
      const Product = await productModel.findOne({ _id: id });
      if (!Product) {
        return res.status(404).json({
          status: 404,
          message: "No such product",
        });
      }
      Product.name = req.body.name ? req.body.name : Product.name;
      Product.description = req.body.description
        ? req.body.description
        : Product.description;
      Product.prices = req.body.prices ? req.body.prices : Product.prices;
      Product.stock = req.body.stock ? req.body.stock : Product.stock;
      Product.userId = req.body.userId ? req.body.userId : Product.userId;
      Product.createdAt = req.body.createdAt
        ? req.body.createdAt
        : Product.createdAt;

        if(req.file){
          const oldFilename = Product.image.split("/products/")[1]
          Product.image = `${req.protocol}://${req.get("host")}/images/products/${req.file.filename}`
          fs.unlink(`public/images/products/${oldFilename}`,(err)=>{
            if(err){
              console.log(err.message);
              
            }
         })

        }
      var product = await Product.save();
      if (product) {
        return res.status(203).json({
          status: 203,
          message: " product updated",
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: "error while getting product",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting product",
      });
    }
  },

  removeProduct: async (req, res) => {
    const id = req.params.id;
    try {
      const Product = await productModel.findByIdAndDelete(id);
      if (!Product) {
        return res.status(404).json({
          status: 404,
          message: "No such product",
        });
      }
      const filename = Product.image.split("/products/")[1]
           fs.unlink(`public/images/products/${filename}`,(err)=>{
              if(err){
                console.log(err.message);
                
              }
           })

      return res.status(204).json({
        status: 204,
        message: " product delection successfuly",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while deleting product",
      });
    }
  },
};
