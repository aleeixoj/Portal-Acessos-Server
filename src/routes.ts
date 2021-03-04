import express from 'express'
import multer from 'multer'
import multerConfig from './config/multer'
import IncController from './controllers/IncController'
import SignController from './controllers/SignController'
import DataController from './controllers/DataController'
import MyIncController from './controllers/MyIncController'
import UsersController from './controllers/UsersController'

const acc = express.Router()
process.env.SECRET_KEY = 'secret'

const upload = multer(multerConfig)

//Login

acc.post('/login', SignController.index)
acc.post('/logout', SignController.logout)
acc.get('/user', SignController.show)

//Users
acc.get('/getUsers', UsersController.busca)
acc.get('/allusers', UsersController.all)
acc.post('/edituser', UsersController.edit)

//Tickets
acc.post('/insert', upload.single('file'), IncController.create)
acc.post('/insert/data', IncController.createData)
acc.post('/busca', IncController.busca)

acc.get('/relatorio', IncController.relatorio)
acc.put('/reabre', IncController.reabre)
acc.put('/cancela', IncController.cancela)
acc.put('/atribuir', IncController.index)
acc.put('/rotear', IncController.rotear)
acc.put('/edit-row', IncController.editRow)
acc.post('/fechar', IncController.fechar)

//My Tickets
acc.get('/my/data/seven', MyIncController.seven)
acc.get('/my/data/fifteen', MyIncController.fifteen)
acc.get('/my/data/thirty', MyIncController.thirty)
acc.get('/mydata', MyIncController.myData)
acc.get('/mydata/closed', MyIncController.myDataClosed)

//data
acc.get('/data', DataController.data)
acc.get('/data/seven', DataController.seven)
acc.get('/data/fifteen', DataController.fifteen)
acc.get('/data/thirty', DataController.thirty)

acc.get('/getSystems', DataController.systems)
acc.get('/getTypes', DataController.types)
acc.post('/add-sistema', DataController.addSistema)
acc.post('/add-type', DataController.addType)

export default acc
