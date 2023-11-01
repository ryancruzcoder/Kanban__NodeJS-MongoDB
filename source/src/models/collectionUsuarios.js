// Criação do modelo de Tabela de Usuários

const mongoose = require('mongoose')

const collectionUsuariosSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cargo: { type: String, required: true },
    usuario: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true }
})

const collectionUsuarios = mongoose.model('Usuário', collectionUsuariosSchema)

module.exports = collectionUsuarios