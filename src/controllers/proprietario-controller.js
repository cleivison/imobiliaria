const Proprietario = require('../models').Proprietario;
const Endereco = require('../models').Endereco;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async post(req, res) {
        try {
            const proprietario = await Proprietario.create(req.body,{
                include:[
                    {
                        model: Endereco
                    }
                ]
            })
            res.status(200).json({
                proprietario: proprietario,
                error: false
            });
        } catch (err) {
            res.status(200).json({
                message: err,
                mensagem: "Verifique se todos os campos foram preenchidos corretamente",
                error: true
            });
        }  
           
        // await Proprietario.create(req.body,{
        //     include:[
        //         {
        //             model: Endereco
        //         }
        //     ]
        // })
        // .then( Proprietario => {                
        //     res.status(200).send(Proprietario);
        // }).catch( err => {
        //     res.status(403).send({
        //         message: err.message || "Some error occurred while creating Proprietario"
        //     });
        // });        
    },    

    async get(req, res) {
        const offset = parseInt((req.query.page - 1) * req.query.pageSize);
        const limit = parseInt(req.query.pageSize);
        const pesquisa = req.query.search || '';

        await Proprietario.findAndCountAll({
            include:[
                {
                    model: Endereco,
                }
            ],
            where: {
                [Op.or]: {
                    'nome': {[Op.like]: '%'+pesquisa+'%'},
                    'cpf': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.rua$': {[Op.like]: '%'+pesquisa+'%'}, 
                    '$Endereco.bairro$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.cidade$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.estado$': {[Op.like]: '%'+pesquisa+'%'}
                }
            },
            offset: offset,
            limit: limit,
            raw: true,
            nest: true,
            order: [
                ['createdAt', 'ASC'],
            ],
        })
       .then( result => {    
            let proprietario = result.rows;        
            res.status(200).send({proprietario: proprietario, count: result.count});
       }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Proprietario."
            });
       });
     },
    async pers(req, res) {
        
        const {pesquisa} = req.query;
        
        await Proprietario.findAll({  
            where: { 
                [Op.or]: {
                    nome: {[Op.like]: '%'+pesquisa+'%'},
                    cpf: {[Op.like]: '%'+pesquisa+'%'}
                }
            }
        })
       .then( Proprietario => {            
            res.status(200).send(Proprietario);
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Proprietario."
            });
        });
    },
    async getById(req, res) {
        
        await Proprietario.findOne({
            include: [{
                model:Endereco
            }],
            where :{id:req.params.id}
        })
       .then( proprietario => {
            if(!proprietario){

                res.status(404).send({
                    message: "Proprietario not found"
                });
            }            
            res.status(200).send(proprietario);
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(404).send({
                    message: "Proprietario not found"
                });
            }
            res.status(403).send({
                message: "Some error occurred while retrieving Proprietario"
            });
       });
     },

    async put(req, res) {

        await Proprietario.findOne({
            include:[
                {
                    model: Endereco
                }
            ],
            where :{id:req.params.id}
        })
            .then(Proprietario => {
                if(!Proprietario) {
                    return res.status(404).send({
                        message: "Proprietario not found"
                    });
                }  
                return Proprietario.Endereco.update(req.body.Endereco).then(function (Endereco) {
                    return Proprietario.update(req.body);
                });
            })
            .then(ProprietarioUpdate => {
              res.json(ProprietarioUpdate);
            }).catch( err => {

                res.status(500).send({
                    message: err.message || "Error updating Proprietario."
                });
           });
    },

    async delete(req, res) {

        await Proprietario.findOne({where :{id:req.params.id}})
            .then(Proprietario => {
                if(!Proprietario) {
                    return res.status(404).send({
                        message: "Proprietario not found"
                    });
                }  
                return Proprietario.destroy()              
            })
            .then(destroyed => {
                res.status(200).send( {message:"Proprietario deleted successfully!"});
            }).catch( err => {
                res.status(500).send({
                    message: err.message || "Could not delete Proprietario"
                });
           });
    },

}