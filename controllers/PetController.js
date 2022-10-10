const Pet = require('../models/Pet')

//Helpers
//necessário para pegar (get) os dados do usuário dono do pet
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')
const ObjectId = require('mongoose').Types.ObjectId

//Module de classes que contêm os controllers
module.exports = class PetController {
  
  // ******** Criar Pet ******** //
  static async create(req, res) {

    const {name, age, weigth, color} = req.body

    //De onde vem as imagens - files no plural por se tratar de várias imagens
    const images = req.files

    //Disponibilidade de adoção do pet
    const available = true

     //Validações
    if(!name) {
      res.status(422).json({ message: 'O nome é obrigatório'})
      return
    }
    if(!age) {
      res.status(422).json({ message: 'A idade é obrigatória'})
      return
    }
    if(!weigth) {
      res.status(422).json({ message: 'O peso é obrigatório'})
      return
    }
    if(!color) {
      res.status(422).json({ message: 'A cor é obrigatória'})
      return
    }
    if(images.length === 0 ) {
      res.status(422).json({ message: 'A imagem é obrigatória'})
      return
    }

    //Pegar o usuário dono do pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    //Criar o pet
    const pet = new Pet ({
      name,
      age, 
      weigth, 
      color,
      available,
      images: [],
      //Dados do usuário para o adotante entrar em contato
      user: {
        _id: user._id,
        name: user.name,
        image: user.image,
        phone: user.phone,
      },
    })

    //Receber, percorrer o array e nomear as imagens
    images.map((image) => {
      pet.images.push(image.filename)
    })
    
    //Tratar erros
    try{
      const newPet = await pet.save() //método do mongoose
      res.status(201).json({message: 'Pet cadastrado com sucesso', newPet,})
    } 
    catch(error){
      res.status(500).json({message: error})
    }
  }

  // ***** Pegar e exibir todos os pets ***** //    
  static async getAll(req, res) {

    const pets = await Pet.find().sort('-createdAt') //(-createdAt) exibe crescente (do novo ao velho)

    res.status(200).json({ pets: pets, })
  }

  // ***** Pegar todos os pets dos usuários individualmente ***** //
  static async getAllUserPets(req, res) {

    //Pegar o usuário dono do pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    //No find, 'user._id' como filtro e user._id como variável
    const pets = await Pet.find({ 'user._id': user._id }).sort('-createdAt')  
    
    res.status(200).json({ pets, })  
  }

  // *** Pegar os pets adotados pelo usuário *** //
  static async getAllUserAdoptions(req, res) {

    //Pegar o usuário dono do pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    //No find, 'user._id' como filtro e user._id como variável
    const pets = await Pet.find({ 'adopter._id': user._id }).sort('-createdAt')  
    
    res.status(200).json({ pets, })  
  }

  // *** Pegar os pets pelo seu id *** //
  static async getPetById(req, res) {

    const id = req.params.id

    //Checa a validade do id
    if(!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido' })
      return
    }  
    
    //Checar se o pet existe
    const pet = await Pet.findOne({ _id: id })
    
    if(!pet) {
      res.status(404).json({ message: 'Pet não encontrado' })
    } 
    
    res.status(200).json({ pet: pet, })  
  }

  // ******** Remover o pet pelo id ******** //
  static async removePetById(req, res) {

    const id = req.params.id

    //Checa a validade do id
    if(!ObjectId.isValid(id)) {
      res.status(422).json({ message: 'ID inválido' })
      return
    } 
    
    //Checar se o pet existe
    const pet = await Pet.findOne({ _id: id })

    if(!pet) {
      res.status(404).json({ message: 'Pet não encontrado' })
      return
    } 
    
    //Verificar se o usuário logado é o mesmo que registrou o pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if(pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: 'Houve um erro! Não foi possivel processar a sua solicitação, tente mais tarde' })
      return
    }

    await Pet.findByIdAndRemove(id)

    res.status(200).json({ message: 'Pet removido com sucesso'})
  }

  // **** Atualizar o Pet **** //
  static async updatePet(req, res) {

    const id = req.params.id

    const {name, age, weigth, color, available} = req.body

    //De onde vem as imagens - files no plural por se tratar de várias imagens
    const images = req.files

    const  updatedData = {}

    //Verificar se o pet existe
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    //Verificar se o usuário logado é o mesmo que registrou o pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if(pet.user._id.toString() !== user._id.toString()) {
      res.status(422).json({ message: 'Houve um erro! Não foi possivel processar a sua solicitação, tente mais tarde' })
      return
    }

    //Validações
    if(!name) {
    res.status(422).json({ message: 'O nome é obrigatório'})
    return
    } else {
      updatedData.name = name
    }

    if(!age) {
      res.status(422).json({ message: 'A idade é obrigatória'})
      return
    } else {
      updatedData.age = age
    }

    if(!weigth) {
      res.status(422).json({ message: 'O peso é obrigatório'})
      return
    } else {
      updatedData.weigth = weigth
    }

    if(!color) {
      res.status(422).json({ message: 'A cor é obrigatória'})
      return
    } else {
      updatedData.color = color
    }

    if(images.length === 0 ) {
      res.status(422).json({ message: 'A imagem é obrigatória'})
      return
    } else {
      updatedData.images = []
      images.map((image) => {
        updatedData.images.push(image.filename)
      })
    }

    await Pet.findByIdAndUpdate(id, updatedData)

    res.status(200).json({ message: 'Pet atualizado com sucesso'})
  }

  // ******** Agendar visita ******** //
  static async schedule(req, res) {

    const id = req.params.id

    //Verificar se o pet existe
    const pet = await Pet.findOne({ _id: id })

    if (!pet) {
      res.status(404).json({ message: 'Pet não encontrado!' })
      return
    }

    //Checar se o usuário é o dono do pet
    const token = getToken(req)
    const user = await getUserByToken(token)

    if (pet.user._id.equals(user._id)) {
      res.status(422).json({
        message: 'Você não pode agendar uma visita com seu próprio Pet!',
      })
      return
    }
  
    //Verificar se o usuário já agendou uma visita
    if (pet.adopter) {
      if (pet.adopter._id.equals(user._id)) {
        res.status(422).json({
          message: 'Você já agendou uma visita para este Pet!',
        })
        return
      }
    }

    //Adicionar o usuário para o pet
    pet.adopter = {
      _id: user._id,
      name: user.name,
      image: user.image,
    }

    await Pet.findByIdAndUpdate(pet._id, pet)

    res.status(200).json({ message: `Visita agendada com sucesso. Entre em contato com ${pet.user.name} no telefone: ${pet.user.phone}`,
    })
  }

  // ****** Concluir o processo de adoção ****** //
  static async concludeAdoption(req, res) {

    const id = req.params.id

    //Checar se o pet existe
    const pet = await Pet.findOne({ _id: id })

    pet.available = false

    await Pet.findByIdAndUpdate(pet._id, pet)

    res.status(200).json({ message: `Parabéns! O processo de adoção foi finalizado com sucesso!`, })
  }
}

