const fs = require("fs");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require('nodemailer'); 


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
  signupUser: async (req, res) => {
    console.log(req.body);

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      console.log(req.body);

      if (err) {
        return res.status(500).json({
          status: 500,
          message: err.message,
        });
      }
      console.log(req.body);
      const newUser = new userModel({
        ...req.body,
        password: hash,
      });
      console.log(newUser);

      const user = await newUser.save();
      if (user) {
        return res.status(201).json({
          status: 201,
          message: "user created",
        });
      } else {
        return res.status(400).json({
          status: 400,
          message: err.message,
        });
      }
    });
  },
  loginUser: async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "user not found",
        });
      }
      bcrypt.compare(req.body.password, user.password, (err, valid) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: err.message,
          });
        }
        if (!valid) {
          return res.status(404).json({
            status: 404,
            message: "Bad password",
          });
        }
        return res.status(200).json({
          isSuccess: true,
          userId: user._id,
          token: jwt.sign(
            {
              userId: user._id,
            },
            process.env.TOKEN_SECRET,
            { expiresIn: "1h" }
          ),
          expire: 3600000,
          // 86400000
        });
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
  verifyUser: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(204).json({
          status: 204,
          exist: false,
          message: "No such user",
        });
      }
      return res.status(202).json({
        status: 202,
        exist: true,
        message: "User exist login here or enter a correct email",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
  requestResetPassword: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      console.log(user);
      
      if (!user) {
        return res.status(422).json({
          status: 422,
          exist: false,
          message: "No such user",
        });
      }
      const token = jwt.sign(
        {
          userId: user._id,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1h" }
      )
      console.log(token);
      

      // Envoi de l'e-mail avec le lien de réinitialisation
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "isidoredev9@gmail.com",
          pass: "p u z g l s z r q v x b m h q e",
        },
      });

      const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

      const mailOptions = {
        from: "isidoredev9@gmail.com",
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        html: `<p> Cliquez sur <a href="${resetUrl}"> reinitialiser mon mot de passe </>  pour réinitialiser votre mot de passe </p> `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({
            status: 500,
            message: "Erreur lors de l'envoi de l'email.",
          });
        }
        res.status(200).send({
          ok: true,
          status: 200,
          message: "Email de réinitialisation envoyé.",
        });
      });
      return res.status(202).json({
        ok: true,
        status: 202,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
  resetPassword: async (req, res) => {
    const { token, email, newPassword } = req.body;
    console.log({ token, email, newPassword } )
    console.log(token === undefined);
    
    try {
      // Vérifier le token JWT
      var user;
      if(email){
        console.log("yes");
        
         user = await userModel.findOne({email});
         console.log(user);
         
      } 
      if(token){
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      const userId = decoded.userId;
      console.log(userId);
      
       user = await userModel.findOne({_id : userId});
       console.log(user);
       
      }
      
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "Utilisateur non trouvé.",
        });
      }

      // Hasher le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Mettre à jour le mot de passe
      user.password = hashedPassword;
      user.resetCode = null;
      user.resetCodeExpiration = null;
      await user.save();

      res.status(200).json({
        isSuccess: true,
        status: 200,
        message: "Mot de passe réinitialisé avec succès.",
      });
    } catch (error) {
      return res.status(400).json({
        status: 400,
        message: "Token invalide ou expiré.",
      });
    }
  },
  requestResetPasswordbyCode: async (req, res) => {
    const { email } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(422).json({
          status: 422,
          exist: false,
          message: "No such user",
        });
      }
      const resetCode = crypto.randomInt(100000, 999999).toString();


      // Stocker le code et une date d'expiration (par ex. 1h)
      user.resetCode = resetCode;
      user.resetCodeExpiration = Date.now() + 3600000; // 1 heure en millisecondes
      await user.save();

      // Envoi de l'e-mail avec le lien de réinitialisation
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "isidoredev9@gmail.com",
          pass: "p u z g l s z r q v x b m h q e",
        },
      });

      const mailOptions = {
        from: "isidoredev9@gmail.com",
        to: user.email,
        subject: "Réinitialisation de mot de passe",
        html: `<p> Saisir sur ${resetCode}  pour réinitialiser votre mot de passe </p> `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error.message);
          
          return res.status(505).json({
            status: 505,
            message: "Erreur lors de l'envoi de l'email.",
          });
        }
        
        
        res.status(200).send({
          ok : true,
          status: 200,
          message: "Email de réinitialisation envoyé.",
        });
      });
     
    } catch (error) {
      console.log(error.message);
      
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
  verifyResetCode: async (req, res) => {
    const { email, code } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(444).json({
          status: 444,
          exist: false,
          message: "No such user",
        });
      }
      if (user.resetCode !== code || user.resetCodeExpiration < Date.now()) {
        return res.status(400).json({
          status: 400,
          ok: false,
          message: "Code incorrect ou expiré.",
        });
      }
      return res.status(200).json({
        status: 200,
        ok: true,
        message: "Code vérifié. Vous pouvez réinitialiser votre mot de passe",
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  },
};
