const Pet = require('../models/Pet')

nodule.exports = class PetController {
  
  //Criar Pet
  static async create(req, res) {
    res.json({ message: 'Pet criado'})
  }

}