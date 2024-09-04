var express = require('express');
const ProductImageUpload = require('../middlewares/multer.config');
const userControler = require('../controler/user.controler');
var router = express.Router();


router.get("/", userControler.listUser)
router.get('/:id', userControler.listUserById)
router.post("/signup",  userControler.signupUser)
router.post("/login",  userControler.loginUser)

// router.put("/:id", ProductImageUpload, userControler.updateProduct)
// router.delete("/:id",  userControler.removeProduct)
module.exports = router;
