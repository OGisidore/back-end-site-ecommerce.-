var express = require('express');
const productControler = require('../controler/product.controler');
const ProductImageUpload = require('../middlewares/multer.config')
var router = express.Router();


router.get("/", productControler.listProduct)
router.get('/:id', productControler.listProductById)
router.post("/", ProductImageUpload,  productControler.createProduct)
router.put("/:id", ProductImageUpload, productControler.updateProduct)
router.delete("/:id",  productControler.removeProduct)
module.exports = router;
