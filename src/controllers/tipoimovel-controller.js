const Tipoimovel = require('../models').Tipoimovel;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async post(req, res) {
        
        await Tipoimovel.create(req.body)
        .then( Tipoimovel => {                
            res.status(200).send(Tipoimovel);
        }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while creating Tipoimovel"
            });
        });        
    },
    
    async get(req, res) {
        await Tipoimovel.findAll({
            order: [
                ['createdAt', 'ASC'],
            ],
        })
       .then( tipoImovel => {
            res.status(200).send(tipoImovel);
       }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Tipoimovel."
            });
       });
    },

    async pers(req, res) {
        const offset = (req.query.page - 1) * req.query.pageSize;
        const limit = req.query.pageSize;
        const pesquisa = req.query.search || '';

        await Tipoimovel.findAndCountAll({
            where: {
                'descricao': {[Op.like]: '%'+pesquisa+'%'},
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
            let tipoImovel = result.rows;
            res.status(200).send({tipoImovel: tipoImovel, count: result.count});
       }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Tipoimovel."
            });
       });
     },

    async getById(req, res) {
        
        await Tipoimovel.findOne({where :{id:req.params.id}})
       .then( Tipoimovel => {
            if(!Tipoimovel){

                res.status(404).send({
                    message: "Tipoimovel not found"
                });
            }            
            res.status(200).send(Tipoimovel);
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(404).send({
                    message: "Tipoimovel not found"
                });
            }
            res.status(403).send({
                message: "Some error occurred while retrieving Tipoimovel"
            });
       });
     },

    async put(req, res) {

        await Tipoimovel.findOne({where :{id:req.params.id}})
            .then(Tipoimovel => {
                if(!Tipoimovel) {
                    return res.status(404).send({
                        message: "Tipoimovel not found"
                    });
                }  
                return Tipoimovel.update(req.body);
            })
            .then(TipoimovelUpdate => {
              res.json(TipoimovelUpdate);
            }).catch( err => {

                res.status(403).send({
                    message: err.message || "Error updating Tipoimovel."
                });
           });
    },

    async delete(req, res) {

        await Tipoimovel.findOne({where :{id:req.params.id}})
            .then(Tipoimovel => {
                if(!Tipoimovel) {
                    return res.status(404).send({
                        message: "Tipoimovel not found"
                    });
                }  
                return Tipoimovel.destroy()              
            })
            .then(destroyed => {
                res.status(200).send( {message:"Tipoimovel deleted successfully!"});
            }).catch( err => {
                res.status(403).send({
                    message: err.message || "Could not delete Tipoimovel"
                });
           });
    },

}