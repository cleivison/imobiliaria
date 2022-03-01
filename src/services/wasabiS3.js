const AWS = require('aws-sdk');

class wasabiS3 {
  s3
  constructor() {
    // Connection
    // This is how you can use the .aws credentials file to fetch the credentials
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'wasabi' });
    AWS.config.credentials = credentials;

    // This is a configuration to directly use a profile from aws credentials file.
    AWS.config.credentials.accessKeyId = "3XD0I9ONMDMIZGEP3AT4";
    AWS.config.credentials.secretAccessKey = "Z9YmnsoPzt1KJBVYRmy0iAKErLLH00F5hHZlW6pT";

    // Set the AWS region. us-east-1 is default for IAM calls.
    AWS.config.region = "us-west-1";

    // Set an endpoint.
    const ep = new AWS.Endpoint('s3.wasabisys.com');

    // Create an S3 client
    this.s3 = new AWS.S3({ endpoint: ep });
  }
  getImagens(imovel, resolve) {

    const params = {
      Bucket: 'wpimobiliaria',
      Delimiter: '',
      Prefix: `imoveis/imagens/${imovel.codigo}/`
    }

    this.s3.listObjects(params, function (err, data) {
      if (err) throw err;

      let links = []
      //console.log('LINKS ==>>>>',data)
      for (let files of data.Contents) {
        links.push(files.Key);
      }
      //console.log('LINKS ==>>>>',links)
      imovel.imagens = links;
      resolve(imovel);
    });
  }

  getImagensUrl(resolve) {

    const params = {
      Bucket: 'wpimobiliaria',
      Delimiter: '',
      Prefix: `imoveis/imagens/`
    }

    this.s3.listObjects(params, function (err, data) {
      if (err) throw err;

      let links = []
      //console.log('LINKS ==>>>>',data)
      for (let files of data.Contents) {
        links.push(files.Key);
      }      
      //console.log(links)
      resolve(links)
    });
  }

  uploadFile(imagem, codigo, resolve) {

    const object_upload_params = {
      Body: imagem.data,
      Bucket: "wpimobiliaria",
      Key: 'imoveis/imagens/' + codigo + '/' + imagem.name,
      ACL: 'public-read',
      ContentType: imagem.mimetype
    };

    // upload object to previously created "examplebucket"
    this.s3.putObject(object_upload_params, function (err, data) {
      // if (err) console.log(err, err.stack); // an error occurred
      // else console.log(data); 
      resolve();
      // successful response
    });
  }
}
module.exports = wasabiS3