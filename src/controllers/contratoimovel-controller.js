const Contratoimovel = require('../models').Contratoimovel;
const Inquilino = require('../models').Inquilino;
const Proprietario = require('../models').Proprietario;
const Endereco = require('../models').Endereco;
const Imovel = require('../models').Imovel;
const Recibocontrato = require('../models').Recibocontrato;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async post(req, res) {
        
        await Contratoimovel.create(req.body)
        .then( Contratoimovel => {                
            res.status(200).send(Contratoimovel);
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating Contratoimovel"
            });
        });        
    },

    async get(req, res) {        
        const offset = parseInt((req.query.page - 1) * req.query.pageSize);
        const limit = parseInt(req.query.pageSize);
        const pesquisa = req.query.search || '';
        console.log(pesquisa)    
       
        await Contratoimovel.findAndCountAll({
            include:[
                {
                    model: Imovel,
                    include:[
                        {
                            model: Endereco                          
                        },
                        {
                            model: Proprietario
                        }
                    ]
                },
                {
                    model: Inquilino,
                }
            ],
            where: {
                [Op.or]: {
                    '$Inquilino.nome$': {[Op.like]: '%'+pesquisa+'%'},                    
                    '$Imovel.Endereco.rua$': {[Op.like]: '%'+pesquisa+'%'}, 
                    '$Imovel.Endereco.bairro$': {[Op.like]: '%'+pesquisa+'%'},                    
                }
            },
            offset: offset,
            limit: limit,
            raw: true,
            nest: true,
            order: [
                ['data_inicio', 'ASC'],
            ],
        })
        .then( result => {    
            let contratoimovel = result.rows;                
            res.status(200).send({contratoimoveis: contratoimovel, count: result.count});
       }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Contrato Imovel."
            });
       });
     },

    async get2(req, res) {
        
        await Contratoimovel.findAll()
       .then( Contratoimovel => {            
            res.status(200).send(Contratoimovel);
       }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Contratoimovel."
            });
       });
     },

    async getById(req, res) {
        
        await Contratoimovel.findOne({where :{id:req.params.id}})
       .then( Contratoimovel => {
            if(!Contratoimovel){

                res.status(404).send({
                    message: "Contratoimovel not found"
                });
            }            
            res.status(200).send(Contratoimovel);
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(404).send({
                    message: "Contratoimovel not found"
                });
            }
            res.status(500).send({
                message: "Some error occurred while retrieving Contratoimovel"
            });
       });
     },

    async put(req, res) {
                
        await Contratoimovel.findOne({where :{id:req.params.id}})
            .then(Contratoimovel => {
                if(!Contratoimovel) {
                    return res.status(404).send({
                        message: "Contratoimovel not found"
                    });
                }  
                return Contratoimovel.update(req.body);
            })
            .then(ContratoimovelUpdate => {
              res.json(ContratoimovelUpdate);
            }).catch( err => {

                res.status(500).send({
                    message: err.message || "Error updating Contratoimovel."
                });
           });
    },

    async delete(req, res) {

        await Recibocontrato.destroy({where : {contratoimovel_id: req.params.id}})
        await Contratoimovel.findOne({where :{id:req.params.id}})
            .then(Contratoimovel => {
                if(!Contratoimovel) {
                    return res.status(404).send({
                        message: "Contrato imovel not found"
                    });
                }  
                return Contratoimovel.destroy()              
            })
            .then(destroyed => {
                res.status(200).send( {message:"Contrato imovel deleted successfully!"});
            }).catch( err => {
                res.status(500).send({
                    message: err.message || "Could not delete Contrato imovel"
                });
           });
    },

}