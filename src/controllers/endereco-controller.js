const Endereco = require('../models').Endereco;

module.exports = {

    async post(req, res) {
        
        await Endereco.create(req.body)
        .then( endereco => {                
            res.status(200).send(endereco);
        }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating Endereco"
            });
        });        
    },    

    async get(req, res) {
        
        await Endereco.findAll()
       .then( Endereco => {            
            res.status(200).send(Endereco);
       }).catch( err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Endereco."
            });
       });
     },

    async getById(req, res) {
        
        await Endereco.findOne({where :{id:req.params.id}})
       .then( Endereco => {
            if(!Endereco){

                res.status(404).send({
                    message: "Endereco not found"
                });
            }            
            res.status(200).send(Endereco);
       }).catch( err => {

            if(err.kind === 'ObjectId'){
                 res.status(404).send({
                    message: "Endereco not found"
                });
            }
            res.status(500).send({
                message: "Some error occurred while retrieving Endereco"
            });
       });
     },

    async put(req, res) {

        await Endereco.findOne({where :{id:req.params.id}})
            .then(Endereco => {
                if(!Endereco) {
                    return res.status(404).send({
                        message: "Endereco not found"
                    });
                }  
                return Endereco.update(req.body);
            })
            .then(EnderecoUpdate => {
              res.json(EnderecoUpdate);
            }).catch( err => {

                res.status(500).send({
                    message: err.message || "Error updating Endereco."
                });
           });
    },

    async delete(req, res) {

        await Endereco.findOne({where :{id:req.params.id}})
            .then(Endereco => {
                if(!Endereco) {
                    return res.status(404).send({
                        message: "Endereco not found"
                    });
                }  
                return Endereco.destroy()              
            })
            .then(destroyed => {
                res.status(200).send( {message:"Endereco deleted successfully!"});
            }).catch( err => {
                res.status(500).send({
                    message: err.message || "Could not delete Endereco"
                });
           });
    },

}