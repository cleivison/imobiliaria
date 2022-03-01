const express = require('express');
const AWS = require('aws-sdk');
const routes = new express.Router();

const fs = require('fs');
const multer = require('multer');
const path = require('path');

const authMiddleware = require('./middlewares/auth');
const contratoimovelController = require('./controllers/contratoimovel-controller');
const enderecoController = require('./controllers/endereco-controller');
const imovelController = require('./controllers/imovel-controller');
const inquilinoController = require('./controllers/inquilino-controller');
const proprietarioController = require('./controllers/proprietario-controller');
const tipoimovelController = require('./controllers/tipoimovel-controller');
const userController = require('./controllers/user-controller');
const recibocontratoController = require('./controllers/recibocontrato-controller');

const deleteFiles = require('./services/filesManager').deleteFiles;
const { filesUploadS3, filesFromMultipleDataS3v2 } = require('./services/filesManager');

/* upload de imagens */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'public/uploads/' + req.query.folder;
        fs.exists(folder, exist => {
            if (!exist) {
                return fs.mkdir(folder, error => cb(error, folder));
            }
            cb(null, folder);
        });
    }
    ,
    filename: function (req, file, cb) {
        // error first callback     
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

routes.get('/', (req, res) => {

    res.send("Pagina Inicial");
});

routes.post('/arquivosaws2', async (req, res) => {
    console.log('comecou')
    await filesFromMultipleDataS3v2();
    console.log('acabou')
})
routes.post('/arquivosaws', (req, res) => {

    // Connection
    // This is how you can use the .aws credentials file to fetch the credentials
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'wasabi' });
    AWS.config.credentials = credentials;

    // This is a configuration to directly use a profile from aws credentials file.
    AWS.config.credentials.accessKeyId = "3XD0I9ONMDMIZGEP3AT4";
    AWS.config.credentials.secretAccessKey = "Z9YmnsoPzt1KJBVYRmy0iAKErLLH00F5hHZlW6pT";

    // Set the AWS region. us-east-1 is default for IAM calls.
    AWS.config.region = "us-west-1";

    // Set an endpoint.
    const ep = new AWS.Endpoint('s3.wasabisys.com');

    // Create an S3 client
    const s3 = new AWS.S3({ endpoint: ep });

    // The following example creates an object. If the bucket is versioning enabled, S3 returns version ID in response.
    // set key and bucket.   
    let imagens=[]
    Object.keys(req.files).forEach(function(key) {     
        imagens.push(req.files[key])
    });
    //console.log('TESTE ===>>>', imagens);
    
    const object_upload_params = {
        Body: imagens[0].data,
        Bucket: "wpimobiliaria",
        Key: 'imoveis/imagens/teste/'+imagens[0].name,
        ACL: 'public-read',   
        ContentType: imagens[0].mimetype    
    };

    // upload object to previously created "examplebucket"
    s3.putObject(object_upload_params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else console.log(data); 
        return res.status(201).send()          // successful response
    });

    // const params = { 
    //  Bucket: 'wpimobiliaria',
    //  Delimiter: '',
    //  Prefix: 'imoveis/imagens/85/'
    // }

    // s3.listObjects(params, function (err, data) {
    //  if(err)throw err;
    //  console.log(data);
    // });    
});

/* Rota Upload */
//routes.post('/uploads', upload.array('file'), (req, res) => {
routes.post('/uploads', async (req, res) => {
    if(req.files) {
        let imagens=[]
        Object.keys(req.files).forEach(function(key) {     
            imagens.push(req.files[key])
        });
        console.log('imagens para upload =>>', imagens);
        const codigo = req.query.folder;
        await filesUploadS3(imagens, codigo)
        return res.status(201).send(console.log('imagens upload completa!'));
    }
   
    // if (req.body.removidos) {
    //     const baseFolder = 'public/uploads/';
    //     let pathName = baseFolder + req.query.folder;
    //     deleteFiles(pathName, req.body.removidos);
    // }

    res.send(console.log('no file =>>'));
});
/*INICIO Rotas PUBLICAS */

/*Rotas User */
routes.post('/user/register', userController.register);
routes.post('/user/login', userController.login);
routes.post('/user/forgotpassword', userController.forgotPassword);
routes.post('/user/recoverypassword', userController.recoveryPassword);

/* Rotas Imovel */
routes.get('/imovel/pers/', imovelController.pers);
routes.get('/imovel/destaques', imovelController.destaques);

/* Rotas Tipoimovel */
routes.get('/tipoimovel', tipoimovelController.get);

/*FINAL Rotas PUBLICAS */

//routes.use(authMiddleware);

/* Rotas Contratoimovel */
routes.get('/contratoimovel', authMiddleware, contratoimovelController.get);
routes.get('/contratoimovel/:id', authMiddleware, contratoimovelController.getById);
routes.post('/contratoimovel', authMiddleware, contratoimovelController.post);
routes.put('/contratoimovel/:id', authMiddleware, contratoimovelController.put);
routes.delete('/contratoimovel/:id', authMiddleware, contratoimovelController.delete);

/* Rotas Recibocontrato */
routes.get('/recibocontrato', authMiddleware, recibocontratoController.get);
routes.get('/recibocontrato/:id', authMiddleware, recibocontratoController.getById);
routes.get('/recibocontrato/contrato/:id', authMiddleware, recibocontratoController.getByContratoId);
routes.post('/recibocontrato', authMiddleware, recibocontratoController.post);
routes.put('/recibocontrato/:id', authMiddleware, recibocontratoController.put);
routes.delete('/recibocontrato/:id', authMiddleware, recibocontratoController.delete);

/* Rotas Endereco */
routes.get('/endereco', authMiddleware, enderecoController.get);
routes.get('/endereco/:id', authMiddleware, enderecoController.getById);
routes.post('/endereco', authMiddleware, enderecoController.post);
routes.put('/endereco/:id', authMiddleware, enderecoController.put);
routes.delete('/endereco/:id', authMiddleware, enderecoController.delete);

/* Rotas Imovel */
routes.get('/imovel', authMiddleware, imovelController.get);
routes.get('/imovel/pers', authMiddleware, imovelController.pers);
routes.get('/imovel/pers2', authMiddleware, imovelController.pers2);
routes.get('/imovel/:id', authMiddleware, imovelController.getById);
routes.post('/imovel', authMiddleware, imovelController.post2);
routes.put('/imovel/:id', authMiddleware, imovelController.put);
routes.delete('/imovel/:id', authMiddleware, imovelController.delete);

/* Rotas Inquilino */
routes.get('/inquilino', authMiddleware, inquilinoController.get);
routes.get('/inquilino/pers/', authMiddleware, inquilinoController.pers);
routes.get('/inquilino/:id', authMiddleware, inquilinoController.getById);
routes.post('/inquilino', authMiddleware, inquilinoController.post);
routes.put('/inquilino/:id', authMiddleware, inquilinoController.put);
routes.delete('/inquilino/:id', authMiddleware, inquilinoController.delete);

/* Rotas Proprietario */
routes.get('/proprietario', authMiddleware, proprietarioController.get);
routes.get('/proprietario/pers/', authMiddleware, proprietarioController.pers);
routes.get('/proprietario/:id', authMiddleware, proprietarioController.getById);
routes.post('/proprietario', authMiddleware, proprietarioController.post);
routes.put('/proprietario/:id', authMiddleware, proprietarioController.put);
routes.delete('/proprietario/:id', authMiddleware, proprietarioController.delete);

/* Rotas Tipoimovel */
routes.get('/tipoimovel/pers/', authMiddleware, tipoimovelController.pers);
routes.get('/tipoimovel/:id', authMiddleware, tipoimovelController.getById);
routes.post('/tipoimovel', authMiddleware, tipoimovelController.post);
routes.put('/tipoimovel/:id', authMiddleware, tipoimovelController.put);
routes.delete('/tipoimovel/:id', authMiddleware, tipoimovelController.delete);

module.exports = routes;
