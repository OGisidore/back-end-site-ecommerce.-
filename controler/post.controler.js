const postModel = require("../models/post.model");
const fs = require("fs")

module.exports = {
  
  listPost: async (req, res) => {
    try {
      const posts = await postModel.find();
      return res.status(200).json({
        status: 200,
        posts: posts,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting post",
      });
    }
  },
  getLatestPost: async(resq , res)=>{
    try {
      const latestpost = await postModel.findOne().sort({publishedAt: -1})
      if(!latestpost){
        return res.status(404).json({
          status : 404,
          message : " no latest post"
        })
      }
      return res.status(200).json({
        status : 200,
        post : latestpost
      })
      
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting post",
      });
    }

  },
  listPostById: async (req, res) => {
    const id = req.params.id;
    try {
      const post = await postModel.findOne({ _id: id });
      if (!post) {
        return res.status(404).json({
          status: 404,
          message: "No such post",
        });
      }
      return res.status(201).json({
        status: 201,
        post: post,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting post",
      });
    }
  },

  createPost: async (req, res) => {
    if(!req.file){
      return res.status(500).json({
        status: 500,
        message: " post image is required",
        error: error,
      });
    }
    const Post = JSON.parse(req.body.post)
    delete Post._id;
    var post = new postModel({
      ...req.body,
      image : `${req.protocol}://${req.get("host")}/images/posts/${req.file.filename}`
    });
    try {
      await post.save();
      return res.status(202).json({
        status: 202,
        message: "post added succesfully",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: " error adding the post",
        error: error,
      });
    }
  },

  updatePost: async (req, res) => {
    const id = req.params.id;
    try {
      const Post = await postModel.findOne({ _id: id });
      if (!Post) {
        return res.status(404).json({
          status: 404,
          message: "No such post",
        });
      }
      Post.title = req.body.title ? req.body.title : Post.title;
      Post.content = req.body.content
        ? req.body.content
        : Post.content;
      Post.category = req.body.category ? req.body.category : Post.category;
      Post.userId = req.body.userId ? req.body.userId : Post.userId;
      Post.publishedAt = req.body.publishedAt
        ? req.body.publishedAt
        : Post.publishedAt;

        if(req.file){
          const oldFilename = Post.image.split("/posts/")[1]
          Post.image = `${req.protocol}://${req.get("host")}/images/posts/${req.file.filename}`
          fs.unlink(`public/images/posts/${oldFilename}`,(err)=>{
            if(err){
              console.log(err.message);
              
            }
         })

        }
      var post = await Post.save();
      if (post) {
        return res.status(203).json({
          status: 203,
          message: " post updated",
        });
      } else {
        return res.status(500).json({
          status: 500,
          message: "error while getting post",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting post",
      });
    }
  },

  removePost: async (req, res) => {
    const id = req.params.id;
    try {
      const post = await postModel.findByIdAndDelete(id);
      if (!post) {
        return res.status(404).json({
          status: 404,
          message: "No such post",
        });
      }
      const filename = post.image.split("/posts/")[1]
           fs.unlink(`public/images/posts/${filename}`,(err)=>{
              if(err){
                console.log(err.message);
                
              }
           })

      return res.status(204).json({
        status: 204,
        message: " post delection successfuly",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while deleting post",
      });
    }
  },
};
