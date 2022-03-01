const Inquilino = require('../models').Inquilino;
const Endereco = require('../models').Endereco;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async post(req, res) {
        try {
            const inquilino = await Inquilino.create(req.body,{
                include:[
                    {
                        model: Endereco
                    }
                ]
            })
                  
            res.status(200).json({
                inquilino: inquilino,
                error: false
            });    
        } catch(err) {
            res.status(200).json({
                error: true,
                message: err,
                mensagem: "Verifique se todos os campos foram preenchidos corretamente"
            });
        }
        // await Inquilino.create(req.body,{
        //     include:[
        //         {
        //             model: Endereco
        //         }
        //     ]
        // })
        // .then( Inquilino => {                
        //     res.status(200).send(Inquilino);
        // }).catch( err => {
        //     res.status(403).send({
        //         message: err.message || "Some error occurred while creating Inquilino"
        //     });
        // });          
    },    

    async get(req, res) {
        const offset = parseInt((req.query.page - 1) * req.query.pageSize);
        const limit = parseInt(req.query.pageSize);
        const pesquisa = req.query.search || '';

        await Inquilino.findAndCountAll({
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
            let inquilino = result.rows;        
            res.status(200).send({inquilino: inquilino, count: result.count});
       }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Inquilino."
            });
       });
     },

     async pers(req, res) {
        
        const {pesquisa} = req.query;
        
        await Inquilino.findAll({  
            where: { 
                [Op.or]: {
                    nome: {[Op.like]: '%'+pesquisa+'%'},
                    cpf: {[Op.like]: '%'+pesquisa+'%'}
                }
            }
        })
       .then( Inquilino => {            
            res.status(200).send(Inquilino);
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Inquilino."
            });
        });
    },

    async getById(req, res) {
        
        await Inquilino.findOne({
            include: [{
                model:Endereco
            }],
            where :{id:req.params.id}
        })
       .then( inquilino => {
            if(!inquilino){

                res.status(404).send({
                    message: "Inquilino not found"
                });
            }            
            res.status(200).send(inquilino);
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(404).send({
                    message: "Inquilino not found"
                });
            }
            res.status(403).send({
                message: "Some error occurred while retrieving Inquilino"
            });
       });
     },
    
     async put(req, res) {

        await Inquilino.findOne({
            include:[
                {
                    model: Endereco
                }
            ],
            where :{id:req.params.id}
        })
        .then(Inquilino => {
            if(!Inquilino) {
                return res.status(404).send({
                    message: "Inquilino not found"
                });
            }  
            return Inquilino.Endereco.update(req.body.Endereco).then(function (Endereco) {
                    return Inquilino.update(req.body);
            });
            })
            .then(InquilinoUpdate => {
              res.json(InquilinoUpdate);
            }).catch( err => {

                res.status(500).send({
                    message: err.message || "Error updating Inquilino."
                });
           });
    },
    async delete(req, res) {

        await Inquilino.findOne({where :{id:req.params.id}})
            .then(Inquilino => {
                if(!Inquilino) {
                    return res.status(404).send({
                        message: "Inquilino not found"
                    });
                }  
                return Inquilino.destroy()              
            })
            .then(destroyed => {
                res.status(200).send( {message:"Inquilino deleted successfully!"});
            }).catch( err => {
                res.status(500).send({
                    message: err.message || "Could not delete Inquilino"
                });
           });
    },
}