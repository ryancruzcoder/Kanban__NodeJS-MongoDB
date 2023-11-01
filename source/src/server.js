const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const routes = require('./routes')
const app = express()
const cookieParser = require('cookie-parser')
require('dotenv').config() // Para utilizarmos nossa chave de conexão do Banco de Dados presente no arquivo ".env"

mongoose.connect(process.env.BDCONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }) // Conexão com o Banco de Dados
app.use(cookieParser()) // Habilitando a funcionalidade dos cookies
app.use(express.urlencoded({extended: true})) // Configuração para receber informações dos formulários
app.use(express.json()) // Definindo como quero receber as informações dos formulários
app.use(express.static(path.resolve(__dirname, '..', 'public', 'assets'))) // Definindo o caminho dos arquivos estáticos
app.set('views', path.resolve(__dirname, '..', 'views')) // Definindo o caminho dos meus arquivos ".ejs"
app.set('view engine', 'ejs') // Configurando a extensão dos meus arquivos ".ejs"
app.use(routes) // Definindo as rotas
app.listen(8080) // Rodando o servidor na porta 8080


