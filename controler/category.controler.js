const categoryModel = require("../models/category.model");

module.exports = {
  
  listcategory: async (req, res) => {
    try {
      const categorys = await categoryModel.find();
      return res.status(200).json({
        status: 200,
        categorys: categorys,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting category",
      });
    }
  },

  // listcategoryById: async (req, res) => {
  //   const id = req.params.id;
  //   try {
  //     const category = await categoryModel.findOne({ _id: id });
  //     if (!category) {
  //       return res.status(404).json({
  //         status: 404,
  //         message: "No such category",
  //       });
  //     }
  //     return res.status(201).json({
  //       status: 201,
  //       category: category,
  //     });
  //   } catch (error) {
  //     return res.status(500).json({
  //       status: 500,
  //       message: "error while getting category",
  //     });
  //   }
  // },

  createcategory: async (req, res) => {
   
    const Category = JSON.parse(req.body.category)
    delete Category._id;
    var category = new categoryModel({
      ...req.body,
    });
    try {
      await category.save();
      return res.status(202).json({
        status: 202,
        message: "category added succesfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: " error adding the category",
        error: error,
      });
    }
  },

  updatecategory: async (req, res) => {
    const id = req.params.id;
    try {
      const category = await categoryModel.findOne({ _id: id });
      if (!category) {
        return res.status(404).json({
          status: 404,
          message: "No such category",
        });
      }
      category.name = req.body.name ? req.body.name : category.name;
      category.description = req.body.description
        ? req.body.description
        : category.description;
      category.userId = req.body.userId ? req.body.userId : category.userId;
      category.createdAt = req.body.createdAt
        ? req.body.createdAt
        : category.createdAt;

       
      var Category = await category.save();
      if (Category) {
        return res.status(203).json({
          status: 203,
          message: " category updated",
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: "error while getting category",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting category",
      });
    }
  },

  removecategory: async (req, res) => {
    const id = req.params.id;
    try {
      const category = await categoryModel.findByIdAndDelete(id);
      if (!category) {
        return res.status(404).json({
          status: 404,
          message: "No such category",
        });
      }
      
      return res.status(204).json({
        status: 204,
        message: " category delection successfuly",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while deleting category",
      });
    }
  },
};
