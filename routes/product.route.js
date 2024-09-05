var express = require('express');
const productControler = require('../controler/product.controler');
const ProductImageUpload = require('../middlewares/multer.config');
const guard = require('../middlewares/guard');
var router = express.Router();


router.get("/", guard, productControler.listProduct)
router.get('/:id',guard, productControler.listProductById)
router.post("/", ProductImageUpload, guard, productControler.createProduct)
router.put("/:id", ProductImageUpload, guard, productControler.updateProduct)
router.delete("/:id", guard, productControler.removeProduct)
module.exports = router;
