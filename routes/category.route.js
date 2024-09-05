var express = require('express');
const categoryControler = require('../controler/category.controler');
const categoryImageUpload = require('../middlewares/multer.config');
const guard = require('../middlewares/guard');
var router = express.Router();


router.get("/", guard, categoryControler.listcategory)
// router.get('/:id',guard, categoryControler.listcategoryById)
router.post("/", categoryImageUpload, guard, categoryControler.createcategory)
router.put("/:id", categoryImageUpload, guard, categoryControler.updatecategory)
router.delete("/:id", guard, categoryControler.removecategory)
module.exports = router;
