const fs = require('fs');
const getImagensS3 = require('./getImagensS3');
const baseFolder = 'public/uploads/';

function getFiles(item, resolve) {         
    let imagens = [];
    fs.readdir(baseFolder+item.codigo, (err, files) => {
        if(files){
            imagens = files;
        }
        item.imagens = imagens;
        resolve(item);
    })                
}

async function filesFromSingleData(item) {
    return new Promise(function(resolve, reject) {
        getFiles(item, resolve);
    });
}

async function filesFromMultipleData(itens) {
    return Promise.all(itens.map(item => filesFromSingleData(item)));
}

async function filesFromMultipleDataS3(itens) {
    let getImage = new getImagensS3();
    return Promise.all(itens.map(item => new Promise(function(resolve, reject) {
            getImage.getImagens(item, resolve)                 
        })
    ))
}

function deleteFiles(pathName, removidos = null, delFolder = false) {
    fs.readdir(pathName, (err, files) => {
        if(files){
            files.forEach(file => {
                try {
                    if(removidos !== null){
                        if(removidos.includes(file)){
                            fs.unlinkSync(pathName+'/'+file);
                        }
                    }else{
                        fs.unlinkSync(pathName+'/'+file);
                    }
                } catch(err) {
                    console.error(err)
                }
            })
        }
        if(delFolder) {
            try {
                fs.rmdirSync(pathName);
            } catch(err) {
                console.error(err)
            }
        }
    });
}

function deleteFilesAndFolder(codigo) {
    let pathName = baseFolder+codigo; 
    deleteFiles(pathName, null, true);
}

module.exports = {
    filesFromSingleData,
    filesFromMultipleData,
    deleteFilesAndFolder,
    deleteFiles,
    filesFromMultipleDataS3
}