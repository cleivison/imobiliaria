const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cors({
    origin: 'http://locahost.com:3000',
    optionsSuccessStatus: 200
}));
app.use(require('./routes'));

app.listen(3333);
