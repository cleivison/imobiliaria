const fs = require('fs');
const wasabiS3 = require('./wasabiS3');
const baseFolder = 'public/uploads/';

function getFiles(item, resolve) {
    let imagens = [];
    fs.readdir(baseFolder + item.codigo, (err, files) => {
        if (files) {
            imagens = files;
        }
        item.imagens = imagens;
        resolve(item);
    })
}

async function filesFromSingleData(item) {
    return new Promise(function (resolve, reject) {
        getFiles(item, resolve);
    });
}

async function filesFromMultipleData(itens) {
    return Promise.all(itens.map(item => filesFromSingleData(item)));
}

async function filesFromMultipleDataS3(itens) {
    let wasabi = new wasabiS3();
    return Promise.all(itens.map(item => new Promise(function (resolve, reject) {
        wasabi.getImagens(item, resolve)
    })
    ))
}

async function filesFromMultipleDataS3v2(itens) {
    let wasabi = new wasabiS3();
    let urlFiles = new Promise((resolve, reject) => {
        wasabi.getImagensUrl(resolve)
    })
    let urlImagens = await urlFiles;
    //console.log('url Imagens ->>>', urlImagens)
    itens = await new Promise((resolve, reject) => {
        for (let item of itens) {
            let imagens = []
            for (let urlimagem of urlImagens) {
                let urlsplited = urlimagem.toString().split('/');                
                if (urlsplited[2] && urlsplited[2] == item.codigo) {
                    imagens.push(urlimagem);
                    item.imagens = imagens;
                }
            }
        }
        resolve(itens)
    })
    return itens;
}

async function filesUploadS3(imagens, codigo) {
    let wasabi = new wasabiS3();
    return Promise.all(imagens.map(imagem => new Promise(function (resolve, reject) {
        wasabi.uploadFile(imagem, codigo, resolve)
    })
    ))
}

function deleteFiles(pathName, removidos = null, delFolder = false) {
    fs.readdir(pathName, (err, files) => {
        if (files) {
            files.forEach(file => {
                try {
                    if (removidos !== null) {
                        if (removidos.includes(file)) {
                            fs.unlinkSync(pathName + '/' + file);
                        }
                    } else {
                        fs.unlinkSync(pathName + '/' + file);
                    }
                } catch (err) {
                    console.error(err)
                }
            })
        }
        if (delFolder) {
            try {
                fs.rmdirSync(pathName);
            } catch (err) {
                console.error(err)
            }
        }
    });
}

function deleteFilesAndFolder(codigo) {
    let pathName = baseFolder + codigo;
    deleteFiles(pathName, null, true);
}

module.exports = {
    filesFromSingleData,
    filesFromMultipleData,
    deleteFilesAndFolder,
    deleteFiles,
    filesFromMultipleDataS3,
    filesUploadS3,
    filesFromMultipleDataS3v2
}