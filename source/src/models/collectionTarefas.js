// Criação do modelo de Tabela de Tarefas

const mongoose = require('mongoose')

const collectionTarefasSchema = new mongoose.Schema({
    destinatario: { type: String, required: true },
    remetente: { type: String, required: true },
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    situacao: { type: String, required: true },
    urgencia: { type: String }
})

const collectionTarefas = mongoose.model('Tarefa', collectionTarefasSchema)

module.exports = collectionTarefas