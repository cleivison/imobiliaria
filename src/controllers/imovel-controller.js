const filesFromSingleData = require('../services/filesManager').filesFromSingleData;
const filesFromMultipleData = require('../services/filesManager').filesFromMultipleData;
const deleteFilesAndFolder = require('../services/filesManager').deleteFilesAndFolder;
const Imovel = require('../models').Imovel;
const Endereco = require('../models').Endereco;
const Contratoimovel = require('../models').Contratoimovel;
const Tipoimovel = require('../models').Tipoimovel;
const Proprietario = require('../models').Proprietario;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {

    async post(req, res) {
        
        await Imovel.create(req.body)
        .then( Imovel => {                
            res.status(200).send(Imovel);
        }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while creating Imovel"
            });
        });        
    },   
    
    async post2(req, res) {
        console.log('POST BODY: ',req);
        await Imovel.create(req.body, {
            include:[
                {
                    model: Endereco
                }
            ]
        })
        .then( Imovel => {                
            res.status(200).send(Imovel);
        }).catch( err => {
            res.status(403).send({
                message: err.message || "Some error occurred while creating Imovel"
            });
        });        
    },  

    async get(req, res) {
        const offset = parseInt((req.query.page - 1) * req.query.pageSize);
        const limit = parseInt( req.query.pageSize);
        const pesquisa = req.query.search || '';
        console.log('LIMITE ----__+++_+++>>>,', limit, offset)
        let codigoWhere = {};

        if(pesquisa){
            if(!isNaN(pesquisa)){
                codigoWhere = {'codigo': parseInt(pesquisa)};
            }
        }

        await Imovel.findAndCountAll({
            include:[{
                    model: Proprietario,
                },
                {
                    model: Endereco,
                },
                {
                    model: Tipoimovel
                },
            ],
            where: {
                [Op.or]: {
                    ...codigoWhere,
                    'finalidade': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.rua$': {[Op.like]: '%'+pesquisa+'%'}, 
                    '$Endereco.bairro$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.cidade$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.estado$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.referencia$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Proprietario.nome$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Tipoimovel.descricao$': {[Op.like]: '%'+pesquisa+'%'}
                }
            },
            offset: offset,
            limit: limit,
            raw: true,
            nest: true,
            order: [
                ['codigo', 'ASC'],
            ],
        })
       .then(async (result) => {            

        const Imovel = result.rows;

        let imovelcustom = await filesFromMultipleData(Imovel);
        console.log('passou -====<>>>')
        res.status(200).send({imoveis: imovelcustom, count: result.count});
       }).catch( err => {
           console.log('error -====<>>>', err)
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Imovel."
            });
       });
     },

    async pers(req, res) {
        const offset = parseInt((req.query.page - 1) * req.query.pageSize);
        const limit = parseInt( req.query.pageSize);
        const {pesquisa, qtd_quartos, qtd_garagem, qtd_banheiros, finalidade, tipo} = req.query;

        let imovelparans = {
            '$Endereco.bairro$': {[Op.like]: '%'+pesquisa+'%'},
            '$Endereco.rua$': {[Op.like]: '%'+pesquisa+'%'}
        };

        if(pesquisa){
            if(!isNaN(pesquisa)){
                imovelparans = {'codigo': parseInt(pesquisa)};
            }
        }
 
        const parametros = {
            [Op.or]: imovelparans
        };
        
        if(qtd_quartos > 0){
            //parametros.qtd_quartos = {[Op.lte]: qtd_quartos};
            parametros.qtd_quartos = qtd_quartos;
        }
        if(qtd_garagem > 0){
            parametros.qtd_garagem = qtd_garagem;
        }
        if(qtd_banheiros > 0){
            parametros.qtd_banheiros = qtd_banheiros;
        }
 
        if(finalidade){
            parametros.finalidade = finalidade;
        }
        
        const tipoWhere = {};
        if(tipo){
            tipoWhere.where = {id: tipo};
        }
        console.log( parametros.qtd_banheiros,  parametros.qtd_quartos)
        await Imovel.findAndCountAll({
            include:[{
                    model: Proprietario,
                },
                {
                    model: Endereco,
                    required: true
                },               
                {
                    model: Tipoimovel,
                    ...tipoWhere
                },
                {
                    model: Contratoimovel,
                },
            ],
            
            where: parametros,
            offset: offset,  
            limit: limit,          
            raw: true,
            nest: true,
            order: [
                ['codigo', 'ASC'],
            ],
        })
       .then(async (result) => {                         
            const Imovel = result.rows;                                  
            let imovelcustom = await filesFromMultipleData(Imovel);           
            res.status(200).send({imoveis: imovelcustom, count: result.count});
        }).catch( err => {
             console.log('error -====<>>>', err)
            res.status(403).send({
                message: err.message || "Some error occurred while retrieving Imovel."
            });
        });
    },

    async pers2(req, res) {
        
        const {pesquisa} = req.query;
        
        await Imovel.findAll({  
            include:[
                {
                    model: Endereco,                 
                }
            ],
            where: { 
                [Op.or]: {
                    '$Endereco.bairro$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.rua$': {[Op.like]: '%'+pesquisa+'%'},
                    '$Endereco.numero$': {[Op.like]: '%'+pesquisa+'%'}
                }
            }
        })
       .then( Imovel => {            
            res.status(200).send(Imovel);
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Imovel."
            });
        });
    },

    async destaques(req, res) {
                   
        await Imovel.findAll({             
            where: { 
                destaque: true
            }            
        })
       .then( async Imovel => {      
            
            const imoveis = Imovel.map((item) => { return (item.dataValues)} )               
            const imovelcustom = await filesFromMultipleData(imoveis);                         
            res.status(200).send({imoveis: imovelcustom});
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Imovel."
            });
        });
    },

    async getById(req, res) {
        
        await Imovel.findOne({
            include:[{
                model: Proprietario
            },
            {
                model: Endereco
            },
            {
                model: Tipoimovel
            }
            ],
            where :{codigo:req.params.id},
            raw: true,
            nest: true
        })
       .then( async (Imovel) => {
            if(!Imovel){

                res.status(403).send({
                    message: "Imovel not found"
                });
            }

            let imovelcustom = await filesFromSingleData(Imovel);
        
            res.status(200).send(imovelcustom);                        
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(403).send({
                    message: "Imovel not found"
                });
            }
            res.status(500).send({
                message: "Some error occurred while retrieving Imovel"
            });
       });
     },

    async put(req, res) {

        await Imovel.findOne({
            include:[
                {
                    model: Endereco
                }
            ],
            where :{codigo:req.params.id}
        })
        .then(Imovel => {
            if(!Imovel) {
                return res.status(404).send({
                    message: "Imovel not found"
                });
            }  

            return Imovel.Endereco.update(req.body.Endereco).then(function (Endereco) {
                return Imovel.update(req.body);
            });
            
        })
        .then(ImovelUpdate => {
            res.json(ImovelUpdate);
        }).catch( err => {

            res.status(403).send({
                message: err.message || "Error updating Imovel."
            });
        });
    },

    async delete(req, res) {
        let codigo = null;
        await Imovel.findOne({where :{id:req.params.id}})
            .then(Imovel => {
                if(!Imovel) {
                    return res.status(404).send({
                        message: "Imovel not found"
                    });
                } 
                codigo = Imovel.codigo; 
                return Imovel.destroy()              
            })
            .then(destroyed => {
                deleteFilesAndFolder(codigo);
                res.status(200).send( {message:"Imovel deleted successfully!"});
            }).catch( err => {
                res.status(403).send({
                    message: err.message || "Could not delete Imovel"
                });
           });
    },

}