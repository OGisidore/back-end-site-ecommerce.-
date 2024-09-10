var express = require('express');
const postControler = require('../controler/post.controler');
const postImageUpload = require('../middlewares/multer.config');
const guard = require('../middlewares/guard');
var router = express.Router();


router.get("/", postControler.listPost)
router.get("/latest", postControler.getLatestPost)
router.get('/:id', postControler.listPostById)
router.post("/", postImageUpload, postControler.createPost)
router.put("/:id", postImageUpload,  postControler.updatePost)
router.delete("/:id", postControler.removePost)
module.exports = router;
