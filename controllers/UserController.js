const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')


module.exports = class UserController {

  //Registrar usuário
  static async register(req, res) {

    const {name, email, phone, password, confirmpassword} = req.body

    //validações
    if(!name) {
      res.status(422).json({ message: 'O nome é obrigatório'})
      return
    }
    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório'})
      return
    }
    if(!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório'})
      return
    }
    if(!password) {
      res.status(422).json({ message: 'A senha é obrigatória'})
      return
    }
    if(!confirmpassword) {
      res.status(422).json({ message: 'Confirmar a senha é obrigatória'})
      return      
    }
    if(password !== confirmpassword) {
      res.status(422).json({ message: 'A confirmação da senha não confere'})
      return      
    }

    //Confirmar se o usuário existe
    const userExists = await User.findOne({email: email})
    if(userExists) {
      res.status(422).json({ message: 'Este email já está em uso. Por favor utilize outro email'})
      return 
    }

    //Criar a senha segura
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //Criar usuário
    const user = new User ({
      name,
      email, 
      phone, 
      password: passwordHash,
    })
    //Tratar erros
    try{
      const newUser = await user.save() //método do mongoose
      await createUserToken(newUser, req, res) //vindo de helpers
    } 
    catch(error){
      res.status(500).json({message: error})
    }
  }
  
  //Efetuar login de usuário
  static async login(req, res) {

    const { email, password } = req.body

    //Validações
    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório'})
      return
    }
    if(!password) {
      res.status(422).json({ message: 'A senha é obrigatória'})
      return
    }

    //Confirmar se o usuário existe
    const user = await User.findOne({email: email})
    if(!user) {
      res.status(422).json({ message: 'Não há usuário cadastrado com este email'})
      return 
    }

    //Confirmar se a senha do usuário confere com a do BD
    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword) {
      res.status(422).json({ message: 'Senha inválida'})
      return 
    }
    await createUserToken(user, req, res) //vindo de helpers    
  }

  //Checar o usuário
  static async checkUser(req, res) {
    //usar let por ser uma variável que terá modificações
    let currentUser  
    
    if(req.headers.authorization) {

      const token = getToken(req)

      //decodificar o token
      const decoded = jwt.verify(token, 'Dfc564YhnUjnkKLLEws108') //Token + SECRET(helpers->create-user-token)

      //o verify retorna todas as propriedades enviadas no token(jwt) que no caso são name, id e secret
      currentUser = await User.findById(decoded.id)

      //remover a senha do retorno
      currentUser.password = undefined
    } 
    else {
      currentUser = null
    }
    res.status(200).send(currentUser)
  }

  //Buscar o usuário pelo id
  static async getUserById(req, res) { 
    //Dados obtidos pelo id da URL (rota dinâmica)
    const id = req.params.id

    //.select('-password') não retorna a senha
    const user = await User.findById(id).select('-password')

    if(!user) {
      res.status(422).json({ message: 'Usuário não encontrado'})
      return 
    }
    res.status(200).json({ user })
  }

  //Atualização do usuário
  static async editUser(req, res) {
    
    const id = req.params.id

    //Checar se o usuário existe
    const token = getToken(req)
    const user = await getUserByToken(token)

    const { name, email, phone, password, confirmpassword } = req.body

    //Imagens
    if(req.file) {
      user.image = req.file.filename
    }

    //validações
    if(!name) {
      res.status(422).json({ message: 'O nome é obrigatório'})
      return
    }
    if(!email) {
      res.status(422).json({ message: 'O email é obrigatório'})
      return
    }
    //Checar se existe um usuário com o email informado
    const userExists = await User.findOne({ email: email })
    
    if(!user) {
      res.status(422).json({ message: 'Usuário não encontrado'})
      return 
    }

    if(user.email !== email && userExists) {
      res.status(422).json({ message: 'Email em uso. Por favor utilize outro email'})
      return 
    }
    user.email = email

    if(!phone) {
      res.status(422).json({ message: 'O telefone é obrigatório'})
      return
    }
    user.phone = phone

    if(password !== confirmpassword) {
      res.status(422).json({ message: 'As senhas não conferem'})
      return      
    }else if(password === confirmpassword && password != null) { 
      //Caso for trocar a senha
      //Criar a senha segura
      const salt = await bcrypt.genSalt(12)
      const passwordHash = await bcrypt.hash(password, salt)

      user.password = passwordHash
    }

    try {
      //Retornar dados atualizados
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $set: user },
        { new: true }
      )
      res.status(200).json({ message: 'Usuário atualizado com sucesso'})
    }
    catch (error) {
      res.status(500).json({ message: error})
      return
    }
  }
}
