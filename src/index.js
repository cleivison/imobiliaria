const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3333;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.use(cors({
    origin: process.env.CORS_URL,
    optionsSuccessStatus: 200
}));
app.use(require('./routes'));

app.listen(port, () => {
    console.info(`Rondando na porta ${port}`);
});
