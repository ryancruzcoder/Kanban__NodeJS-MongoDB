const express = require('express')
const router = express.Router()
const controllers = require('./controllers')

router.get('/', controllers.index)

router.post('/', controllers.cadastro, controllers.index)

router.get('/kanban/', controllers.verificar, controllers.kanban)

router.post('/kanban/', controllers.login, controllers.index)

router.get('/kanban/criartarefa/', controllers.verificar, controllers.teladecriartarefa)

router.post('/kanban/criartarefa/', controllers.criartarefa, controllers.teladecriartarefa)

router.get('/kanban/atualizartarefa/:id', controllers.verificar, controllers.teladeatualizartarefa)

router.get('/kanban/tarefas-enviadas/', controllers.verificar, controllers.kanbanTE)

router.post('/kanban/atualizartarefa/:id', controllers.atualizartarefa, controllers.teladeatualizartarefa)

router.post('/kanban/excluir-tarefa/:id', controllers.excluirtarefa)

router.get('/kanban/membros/', controllers.verificar, controllers.membros)


module.exports = router