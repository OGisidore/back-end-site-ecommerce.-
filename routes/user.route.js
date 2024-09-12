var express = require('express');
const ProductImageUpload = require('../middlewares/multer.config');
const userControler = require('../controler/user.controler');
var router = express.Router();


router.get("/", userControler.listUser)
router.get('/:id', userControler.listUserById)
router.post("/signup",  userControler.signupUser)
router.post("/login",  userControler.loginUser)
router.post("/request-reset-password",  userControler.requestResetPassword)
router.post("/verify-user",  userControler.verifyUser)
router.post("/request-reset-password-By-Code",  userControler.requestResetPasswordbyCode)
router.post("/verify-reset-code",  userControler.verifyResetCode)
router.post("/reset-password",  userControler.resetPassword)




// router.put("/:id", ProductImageUpload, userControler.updateProduct)
// router.delete("/:id",  userControler.removeProduct)
module.exports = router;
