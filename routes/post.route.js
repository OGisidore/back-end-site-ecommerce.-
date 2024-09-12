var express = require('express');
const postControler = require('../controler/post.controler');
const postImageUpload = require('../middlewares/multer.config');
const guard = require('../middlewares/guard');
var router = express.Router();


router.get("/", guard, postControler.listPost)
router.get("/latest", postControler.getLatestPost)
router.get('/:id', guard, postControler.listPostById)
router.get('/byuser/:id', guard, postControler.listPostUserId)
router.post("/", guard, postImageUpload, postControler.createPost)
router.put("/:id", guard, postImageUpload,  postControler.updatePost)
router.delete("/:id", guard, postControler.removePost)
module.exports = router;
