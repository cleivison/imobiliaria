const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require('../models').User;
const authConfig = require('../config/auth');
const mailConfig = require('../config/mail');
const transport = require('../services/sendMail');

module.exports = { 
    async register (req, res) {
        try {
            
            const user = await User.create(req.body);

            return res.status(200).json({ user });
        } catch (err) {
            console.log(err);
            return res.status(400).json({ error: "User registration failed" });
        }
    }
,
    async login(req, res){
        try {
            const { email, password } = req.body;
           
            const user = await User.findOne({where :{ email: email }});
            console.log('===>>>>',user)
            if (!user) {
            return res.status(400).json({ error: "User not found" });
            }
            
            if (!(await user.compareHash(password))) {
            return res.status(400).json({ error: "Invalid password" });
            }
            
            return res.status(200).json({
            user,
            token: user.generateToken()
            });
        } catch (err) {
            return res.status(400).json({ error: "User authentication failed" });
        }
    }
,
    async forgotPassword(req, res){
        try {
            const { email, front_url } = req.body;

            const user = await User.findOne({where :{ email: email }});
        
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }
            
            const token = user.generateToken(1800); // equivalente a 30min
            
            transport.sendMail({
                to: email,
                from: mailConfig.user,
                subject: 'E-mail para recuperação de senha',
                template: 'auth/forgot_password',
                context: {
                    name: user.name,
                    link: front_url+token
                }
            }, (err) => {
                if(err)
                    return res.status(400).send({ error: 'Não foi possível enviar o e-mail de recuperação!' });
            
                return res.status(200).json({
                    success: "E-mail enviado, siga as instruções para recuperar a senha!"
                });
            });
            
        } catch (err) {
            return res.status(400).json({ error: "Recuperação de senha falhou!" });
        }
    }
,
    async recoveryPassword(req, res){
        try {
            const { email, password, passwordConfirm, token } = req.body;

            const user = await User.findOne({where :{ email: email }});
        
            if (!user) {
                return res.status(400).json({ error: "User not found" });
            }

            if(password !== passwordConfirm){
                return res.status(400).json({ error: "Confirmação de senha não está correta!" });
            }

            try {
                const decoded = await promisify(jwt.verify)(token, authConfig.secret);

                if(user.id !== decoded.id){
                    return res.status(400).send({ error: "Token inválido!" });
                }
                
            } catch (err) {
                return res.status(401).send({ error: "Token inválido ou expirado!" });
            }
            
            user.update({password: password});

            return res.status(200).json({
                success: "Senha recuperada com sucesso!"
            });
        } catch (err) {
            return res.status(400).json({ error: "Recuperação de senha falhou!" });
        }
    }
,
}
