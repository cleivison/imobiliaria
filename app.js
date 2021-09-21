const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');
//const redirectSSL = require('./src/middlewares/redirectSSL');
const app = express();

const configs = {
    caminho: "build", //Aqui será definido a pasta de saída onde contém o index.html e os outros arquivos.
    port: process.env.PORT || 3000
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(express.static(configs.caminho));
const whitelist = ['http://localhost:3000/','localhost:3000/', 'http://localhost:3333/', 'localhost:3333/'];
/*
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}));
*/
app.use(cors({
  origin: 'http://locahost.com:3000',
  optionsSuccessStatus: 200
}));

app.use(require('./src/routes'));

//ROTA FRONT END
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, configs.caminho, "index.html"));
});

app.listen(configs.port);
