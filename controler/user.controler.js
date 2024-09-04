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

    bcrypt.hash(req.body.password, 10 , async (err, hash)=>{
        
      if(err){
        return res.status(500).json({
          status : 500,
          message : err.message
        })
      }
      const newUser = new userModel({
        email : req.body.email,
        password : hash
      })
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
  loginUser : (req,res)=>{
    try {
      const user = userModel.findOne({email : req.body.email})
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
          userId : user._id,
          token : jwt.sign(
            {
              userId : user._id 
            },
            'SECRET',
            {expiresIn : '24h'}
          )
        })

      })

    } catch (error) {
      return res.status(404).json({
        status : 404,
        message : "user not found"
      })
      
    }

  }
}