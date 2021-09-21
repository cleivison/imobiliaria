const Recibocontrato = require('../models').Recibocontrato;
const Contratoimovel = require('../models').Contratoimovel;
const Imovel = require('../models').Imovel;
const Inquilino = require('../models').Inquilino;
const Proprietario = require('../models').Proprietario;
const Endereco = require('../models').Endereco;
const Tipoimovel = require('../models').Tipoimovel;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async post(req, res) {
        
        await Recibocontrato.create(req.body)
        .then( Recibocontrato => {                
            res.status(200).send(Recibocontrato);
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating Recibo contrato"
            });
        });        
    },

    async get(req, res) {
        
        await Recibocontrato.findAll()
       .then( recibocontrato => {      
            console.log(recibocontrato)      
            res.status(200).send(recibocontrato);
       }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving recibo contrato."
            });
       });
     },

     async getByContratoId(req, res) {
        
        await Recibocontrato.findAll({
            where: {
                contratoimovel_id: req.params.id
            },
            include:[
                {
                    model: Contratoimovel,
                    include:[
                        {
                            model: Imovel,
                            include:[
                                {
                                    model: Proprietario,
                                    include:[
                                        {
                                            model: Endereco
                                        }
                                    ]
                                },
                                {
                                    model: Endereco
                                },
                                {
                                    model: Tipoimovel
                                }
                            ]
                        },
                        {
                            model: Inquilino 
                        }
                    ]
                }
            ],
            order: [
                ['parcela', 'ASC'], // Sorts by COLUMN_NAME_EXAMPLE in ascending order
          ],
        })
       .then( recibocontrato => {                 
            res.status(200).send(recibocontrato);
       }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving recibo contrato."
            });
       });
     },

    async getById(req, res) {
        
        await Recibocontrato.findOne({where :{id:req.params.id}})
       .then( Recibocontrato => {
            if(!Recibocontrato){

                res.status(404).send({
                    message: "Recibo contrato not found"
                });
            }            
            res.status(200).send(Recibocontrato);
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(404).send({
                    message: "Recibo contrato not found"
                });
            }
            res.status(500).send({
                message: "Some error occurred while retrieving Recibo contrato"
            });
       });
     },

    async put(req, res) {

        await Recibocontrato.findOne({where :{id:req.params.id}})
            .then(Recibocontrato => {
                if(!Recibocontrato) {
                    return res.status(404).send({
                        message: "Recibo contrato not found"
                    });
                }  
                return Recibocontrato.update(req.body);
            })
            .then(RecibocontratoUpdate => {
              res.json(RecibocontratoUpdate);
            }).catch( err => {

                res.status(500).send({
                    message: err.message || "Error updating Recibo contrato."
                });
           });
    },

    async delete(req, res) {

        await Recibocontrato.findOne({where :{id:req.params.id}})
            .then(Recibocontrato => {
                if(!Recibocontrato) {
                    return res.status(404).send({
                        message: "Recibocontrato not found"
                    });
                }  
                return Recibocontrato.destroy()              
            })
            .then(destroyed => {
                res.status(200).send( {message:"Recibo contrato deleted successfully!"});
            }).catch( err => {
                res.status(500).send({
                    message: err.message || "Could not delete Recibo contrato"
                });
           });
    },

}