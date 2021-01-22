import * as express from 'express'
import * as multer from 'multer'
import multerConfig from './config/multer'
import IncController from './controllers/IncController'
import SignController from './controllers/SignController'
import DataController from './controllers/DataController'
import MyIncController from './controllers/MyIncController'
import UsersController from './controllers/UsersController'
const acc = express.Router()
process.env.SECRET_KEY = 'secret'

const upload = multer(multerConfig)

acc.post('/login', SignController.index)
acc.post('/logout', SignController.logout)
acc.get('/user', SignController.show)

acc.get('/getUsers', UsersController.busca)
acc.get('/allusers', UsersController.all)
acc.post('/edituser', UsersController.edit)
acc.get('/sistemas', UsersController.sistemas)
acc.post('/add-sistema', UsersController.addSistema)

acc.post('/insert', upload.single('file'), IncController.create)
acc.post('/insert/data', IncController.createData)
acc.post('/busca', IncController.busca)
acc.get('/data', IncController.data)
acc.get('/mydata', IncController.myData)
acc.get('/mydata/closed', IncController.myDataClosed)
acc.get('/relatorio', IncController.relatorio)
acc.put('/reabre', IncController.reabre)
acc.put('/cancela', IncController.cancela)

acc.get('/data/seven', IncController.seven)
acc.get('/data/fifteen', IncController.fifteen)
acc.get('/data/thirty', IncController.thirty)

acc.get('/my/data/seven', MyIncController.seven)
acc.get('/my/data/fifteen', MyIncController.fifteen)
acc.get('/my/data/thirty', MyIncController.thirty)

acc.put('/atribuir', DataController.index)
acc.put('/rotear', DataController.rotear)
acc.post('/fechar', DataController.fechar)
acc.put('/edit-row', DataController.editRow)

acc.get('/getSystems', DataController.systems)
acc.get('/getTypes', DataController.types)

export default acc
