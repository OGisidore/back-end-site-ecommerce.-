const multer = require("multer");


const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    "image/svg" : "svg",
    "image/webp" : "webp"
}

const storage = multer.diskStorage({
    destination : (req , res , callback)=>{
        callback(null, 'public/images/products')
    },
    filename : (req, file, callback)=>{
        var name  = Math.floor(Math.random() *Math.floor(45257856254)).toString()
        name += Math.floor(Math.random() *Math.floor(452547856254)).toString()
        name += Math.floor(Math.random() *Math.floor(452856254)).toString()
        name += Math.floor(Math.random() *Math.floor(4525856254)).toString()
        name += Math.floor(Math.random() *Math.floor(8545256254)).toString()
        name += Date.now() + "."
       
        const extension = MIME_TYPES[file.mimetype] 
        name += extension
        callback(null , name)

    }
})

module.exports = multer({storage}).single("image")