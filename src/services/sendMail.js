const nodemailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require("path");
const mailConfig = require('../config/mail');

const transport = nodemailer.createTransport({
    host: mailConfig.host,
    port: mailConfig.port,
    auth: {
        user: mailConfig.user,
        pass: mailConfig.pass
    }
});

transport.use('compile', hbs({
    viewEngine: {
        extName: '.html',
        partialsDir: path.resolve('./src/resources/mail/'),
        layoutsDir: path.resolve('./src/resources/mail/'),
        defaultLayout: '',
    },
    viewPath: path.resolve('./src/resources/mail/'),
    extName: '.html',
}));

module.exports = transport;