var express = require('express');
const postControler = require('../controler/post.controler');
const postImageUpload = require('../middlewares/multer.config');
const guard = require('../middlewares/guard');
var router = express.Router();


router.get("/", guard, postControler.listPost)
router.get("/latest", guard, postControler.getLatestPost)
router.get('/:id',guard, postControler.listPostById)
router.post("/", postImageUpload, guard, postControler.createPost)
router.put("/:id", postImageUpload, guard, postControler.updatePost)
router.delete("/:id", guard, postControler.removePost)
module.exports = router;
