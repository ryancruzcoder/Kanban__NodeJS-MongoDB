const collectionUsuarios = require('./models/collectionUsuarios')
const collectionTarefas = require('./models/collectionTarefas')

// Função para renderizar o index
exports.index = (req, res)=>{
    res.cookie('usuario', '')
    res.render('index', {
        alertType: req.alertType,
        alertText: req.alertText
    })
}

// Função para realizar o cadastro do usuário validando os dados
exports.cadastro = (req, res, next)=>{
    if (req.body['senha-de-cadastro'] !== req.body['confirme-sua-senha-de-cadastro']){
        req.alertType = 'danger'
        req.alertText = 'As senhas inseridas não são iguais.'
        next()
    } else {
        collectionUsuarios.findOne({email: req.body['email-de-cadastro']}).then((response)=>{
            if (response){
                req.alertType = 'danger'
                req.alertText = 'O e-mail informado já está sendo utilizado.'
                next()
            } else if (!(req.body['nome-de-cadastro']).trim()){
                req.alertType = 'danger'
                req.alertText = 'O nome informado é inválido.'
                next()
            } else {
                nome_sem_espaco = (req.body['nome-de-cadastro']).trim()
                collectionUsuarios.create({
                    nome: nome_sem_espaco,
                    cargo: req.body['cargo-de-cadastro'],
                    usuario: `${nome_sem_espaco} - ${req.body['cargo-de-cadastro']}`,
                    email: (req.body['email-de-cadastro']).trim(),
                    senha: req.body['senha-de-cadastro']
                })
                req.alertType = 'success'
                req.alertText = 'Usuário cadastrado com sucesso.'
                next()
            }
        })
    }
}

// Função para realizar o login verificando os dados no banco de dados
exports.login = (req, res, next)=>{
    collectionUsuarios.findOne({email: req.body['email-de-entrar'], senha: req.body['senha-de-entrar']}).then((response)=>{
        if (!response){
            req.alertType = 'danger'
            req.alertText = 'E-mail ou senha inválidos.'
            next()
        } else {
            res.cookie('usuario', `${response.nome} - ${response.cargo}`)
            res.redirect('/kanban/')
        }
    })
}

// Função para verificar e o usuário possui cookies salvo, caso contrário terá que refazer o login
exports.verificar = (req, res, next)=>{
    if (req.cookies.usuario){
        next()
    } else {
        res.render('404')
    }
}

// Função para renderizar o kanban com somente as tarefas recebidas pelo usuário
exports.kanban = (req, res)=>{
    let tarefas_afazer = []
    let tarefas_fazendo = []
    let tarefas_aguardando = []
    let tarefas_feito = []
    let tarefas_cancelado = []
    collectionTarefas.find({destinatario: req.cookies.usuario}).then((response)=>{
        for (tarefa of response){
            if (tarefa.situacao === 'A fazer'){
                tarefas_afazer.push(tarefa)
            } else if (tarefa.situacao === 'Fazendo'){
                tarefas_fazendo.push(tarefa)
            } else if (tarefa.situacao === 'Aguardando'){
                tarefas_aguardando.push(tarefa)
            } else if (tarefa.situacao === 'Feito'){
                tarefas_feito.push(tarefa)
            } else if (tarefa.situacao === 'Cancelado'){
                tarefas_cancelado.push(tarefa)
            }
        }
    }).then(()=>{
        res.render('kanban', {
            tarefas_afazer: tarefas_afazer,
            tarefas_fazendo: tarefas_fazendo,
            tarefas_aguardando: tarefas_aguardando,
            tarefas_feito: tarefas_feito, 
            tarefas_cancelado: tarefas_cancelado
        })
    })
}

// Função para renderizar o kanban com somente as tarefas enviadas pelo usuário
exports.kanbanTE = (req, res)=>{
    let tarefas_afazer = []
    let tarefas_fazendo = []
    let tarefas_aguardando = []
    let tarefas_feito = []
    let tarefas_cancelado = []
    collectionTarefas.find({remetente: req.cookies.usuario}).then((response)=>{
        for (tarefa of response){
            if (tarefa.situacao === 'A fazer'){
                tarefas_afazer.push(tarefa)
            } else if (tarefa.situacao === 'Fazendo'){
                tarefas_fazendo.push(tarefa)
            } else if (tarefa.situacao === 'Aguardando'){
                tarefas_aguardando.push(tarefa)
            } else if (tarefa.situacao === 'Feito'){
                tarefas_feito.push(tarefa)
            } else if (tarefa.situacao === 'Cancelado'){
                tarefas_cancelado.push(tarefa)
            }
        }
    }).then(()=>{
        res.render('kanban', {
            tarefas_afazer: tarefas_afazer,
            tarefas_fazendo: tarefas_fazendo,
            tarefas_aguardando: tarefas_aguardando,
            tarefas_feito: tarefas_feito, 
            tarefas_cancelado: tarefas_cancelado,
            tarefas_enviadas: 'true'
        })
    })
}
// Função para renderizar o arquivo de criar tarefas
exports.teladecriartarefa = (req, res)=>{
    collectionUsuarios.find().then((response)=>{
        res.render('criartarefa', {
            usuario: req.cookies.usuario,
            alertType: req.alertType,
            alertText: req.alertText,
            destinatarios: response
        })
    })
}

// Função para criar as tarefas
exports.criartarefa = (req, res, next)=>{
    collectionUsuarios.findOne({usuario: req.body['destinatario-da-tarefa']}).then((response)=>{
        if (!response){
            req.alertType = 'danger'
            req.alertText = 'O destinatário da tarefa não está cadastrado.'
            next()
        } else {
            collectionTarefas.findOne({destinatario: req.body['destinatario-da-tarefa'], titulo: req.body['titulo-da-tarefa']}).then((response)=>{
                if (response){
                    req.alertType = 'danger'
                    req.alertText = 'O destinatário já possui uma tarefa com este título.'
                    next()
                } else {
                    if (req.body['situacao-da-tarefa'] === undefined || req.body['urgencia-da-tarefa'] === undefined){
                        req.alertType = 'danger'
                        req.alertText = 'Dados inválidos.'
                        next()
                    } else {
                        let urgenciaCor
                    if (req.body['urgencia-da-tarefa'] === '⬛ Urgente'){
                        urgenciaCor = '#000'
                    } else if (req.body['urgencia-da-tarefa'] === '🟥 Alta'){
                        urgenciaCor = '#c11d1d'
                    } else if (req.body['urgencia-da-tarefa'] === '🟨 Média'){
                        urgenciaCor = '#e9ed0c'
                    } else if (req.body['urgencia-da-tarefa'] === '🟩 Baixa'){
                        urgenciaCor = '#249706'
                    } 
                    collectionTarefas.create({
                        destinatario: req.body['destinatario-da-tarefa'],
                        remetente: req.cookies.usuario,
                        titulo: req.body['titulo-da-tarefa'],
                        descricao: req.body['descricao-da-tarefa'],
                        situacao: req.body['situacao-da-tarefa'],
                        urgencia: urgenciaCor
                    }).then((response)=>{
                        res.redirect(`/kanban/`)
                    })
                    }
                    
                }
            })
        }
    })
}

// Função para renderizar o arquivo de atualizar tarefas
exports.teladeatualizartarefa = (req, res)=>{
    collectionTarefas.findOne({ _id: req.params.id }).then((response)=>{
        collectionUsuarios.find().then((destinatarios)=>{
            res.render('atualizartarefa', {
                tarefa: response,
                id: req.params.id,
                alertType: req.alertType,
                alertText: req.alertText,
                destinatarios: destinatarios
            })
        })
        
    })
}

// Função para atualizar as tarefas
exports.atualizartarefa = (req, res, next) => {
    collectionUsuarios.findOne({ usuario: req.body['destinatario-da-tarefa'] }).then((response) => {
      if (!response) {
        req.alertType = 'danger';
        req.alertText = 'O destinatário da tarefa não está cadastrado.';
        next();
      } else if (req.body['situacao-da-tarefa'] === undefined || req.body['urgencia-da-tarefa'] === undefined) {
        req.alertType = 'danger';
        req.alertText = 'Dados inválidos.';
        next();
      } else {
        let urgenciaCor;
        if (req.body['urgencia-da-tarefa'] === '⬛ Urgente') {
          urgenciaCor = '#000';
        } else if (req.body['urgencia-da-tarefa'] === '🟥 Alta') {
          urgenciaCor = '#c11d1d';
        } else if (req.body['urgencia-da-tarefa'] === '🟨 Média') {
          urgenciaCor = '#e9ed0c';
        } else if (req.body['urgencia-da-tarefa'] === '🟩 Baixa') {
          urgenciaCor = '#249706';
        }
        collectionTarefas.findOneAndUpdate({ _id: req.params.id }, {
          destinatario: req.body['destinatario-da-tarefa'],
          remetente: req.cookies.usuario,
          titulo: req.body['titulo-da-tarefa'],
          descricao: req.body['descricao-da-tarefa'],
          situacao: req.body['situacao-da-tarefa'],
          urgencia: urgenciaCor
        }).then(() => {
          res.redirect('/kanban/');
        });
      }
    });
};
  

// Função para excluir tarefas
exports.excluirtarefa = (req, res, next)=>{
    collectionTarefas.deleteOne({_id: req.params.id}).then(()=>{
        res.redirect('/kanban/')
    }).catch((err)=>{
        req.alertType = 'danger'
        req.alertText = 'Erro ao excluir a tarefa.'
        next()
    })
}

// Função para exibir a tela de membros
exports.membros = (req, res)=>{
    collectionUsuarios.find().then((response)=>{
        res.render('membros',{
        usuarios: response})
    })
}