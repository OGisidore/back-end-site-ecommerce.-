const multer = require("multer");


const MIME_TYPES = {
    "image/jpg" : "jpg",
    "image/jpeg" : "jpeg",
    "image/png" : "png",
    "image/webp" : "webp"
}

const storage = multer.diskStorage({
    destination : (req , res , callback)=>{
        callback(null, 'public/images/posts')
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
        console.log(name);
        
        callback(null , name)

    }
})

module.exports = multer({storage}).single("image")

// const multer = require('multer');
// const path = require('path');

// // Définir les types MIME autorisés
// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpeg',
//     'image/png': 'png',
//     'image/svg': 'svg',
//     'image/webp': 'webp',
// };

// // Configuration du stockage des fichiers
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/images'); // Chemin où les fichiers seront stockés
//     },
//     filename: (req, file, cb) => {
//         // Création d'un nom de fichier unique
//         const name = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
//         cb(null, name);
//     }
// });

// // Initialisation de Multer avec la configuration
// const upload = multer({ storage: storage });

// module.exports = upload;
