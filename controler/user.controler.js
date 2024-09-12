const fs = require("fs");
const userModel = require("../models/user.model");
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');


module.exports = {
  
  listUser: async (req, res) => {
    try {
      const users = await userModel.find();
      return res.status(200).json({
        status: 200,
        users: users,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting user",
      });
    }
  },

  listUserById: async (req, res) => {
    const id = req.params.id;
    try {
      const user = await userModel.findOne({ _id: id });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "No such user",
        });
      }
      return res.status(201).json({
        status: 201,
        user: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "error while getting user",
      });
    }
  },
  signupUser : async (req ,res)=>{
    console.log(req.body)

    bcrypt.hash(req.body.password, 10 , async (err, hash)=>{
      console.log(req.body)
        
      if(err){
        return res.status(500).json({
          status : 500,
          message : err.message
        })
      }
      console.log(req.body)
      const newUser = new userModel({
        ...req.body,
        password : hash
      })
      console.log(newUser);
      
      const user = await newUser.save()
      if(user){
        return res.status(201).json({
          status:201,
          message : "user created"
        })
      }else{
        return res.status(400).json({
          status : 400, 
          message : err.message
        })
      }
    })

  },
  loginUser : async(req,res)=>{
    try {
      const user = await userModel.findOne({email : req.body.email})
      if(!user){
        return res.status(404).json({
          status : 404,
          message : "user not found"
        })
      }
      bcrypt.compare(req.body.password , user.password, (err, valid)=>{
        if(err){
          return res.status(500).json({
            status : 500,
            message : err.message
          })
        }
        if(!valid){
          return res.status(404).json({
            status : 404,
            message : "Bad password"
          })
        }
        return res.status(200).json({
          isSuccess : true,
          userId : user._id,
          token : jwt.sign(
            {
              userId : user._id 
            },
            process.env.TOKEN_SECRET,
            {expiresIn : '1h'}
          ),
          expire : 3600000  
          // 86400000
        })

      })

    } catch (error) {
      return res.status(500).json({
        status : 500,
        message : error.message
      })
      
    }

  }
}