//Helpers são trechos de códigos que reutilizaremos em várias partes da aplicação
//Neste caso enviar imagens

//Envio de imagens - multiplas
const multer = require('multer')
const path = require('path')

//Destino do armazenamento das imagens
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = ""

    if(req.baseUrl.includes("users")) {
      folder = "users"
    } else if(req.baseUrl.includes("pets")) {
      folder = "pets"
    }
    //Callback
    cb(null, `public/images/${folder}`)

  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    //regex (/\.(png|jpg)$/) para evitar arquivos indesejados como pdf, doc, etc...
    if(!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Por favor, envie imagens jpg ou png!"))
    }
    cb(undefined, true)
  }
})

module.exports = { imageUpload }