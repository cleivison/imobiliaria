const mailConfig = require('../config/mail');
const transport = require('../services/sendMail');

module.exports = { 
    async contato(req, res){
        try {
            const { nome, email, mensagem } = req.body;

            transport.sendMail({
                to: mailConfig.user,
                from: mailConfig.user,
                subject: 'E-mail de contato',
                template: 'contato',
                context: {
                    nome,
                    email,
                    mensagem
                }
            }, (err) => {
                if(err)
                    return res.status(400).send({ error: 'Não foi possível enviar o e-mail de contato!' });
            
                return res.status(200).json({
                    message: "Recebemos sua mensagem, em breve responderemos!"
                });
            });
            
        } catch (err) {
            return res.status(400).json({ error: "Contato falhou!" });
        }
    }
,
}
