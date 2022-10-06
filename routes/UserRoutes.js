const router = require('express').Router()
const UserController = require('../controllers/UserController')

//Middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//Rotas com as funções obtidas do controller
//Rotas abertas
router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/checkuser', UserController.checkUser)
router.get('/:id', UserController.getUserById)

//Rotas protegidas
router.patch('/edit/:id', verifyToken, imageUpload.single("image"), UserController.editUser,)


module.exports = router