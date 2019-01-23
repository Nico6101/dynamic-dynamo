const AWS = require('aws-sdk');
const fs = require('fs');

const dynamo = new AWS.DynamoDB({apiVersion:'2012-10-08'},{region: 'ap-south-1'});

var filename = 'userdetails.txt';
module.exports.upload = (event,context,callback)=>
{
    console.log(event);
    var params =
    {
            TableName : 'userdetails'
    };
dynamo.scan(params, (err,data)=>
{
    
    console.log(JSON.stringify(data.Items));
    
    if(err)
        console.log('unable to scan the table because '+err);
    else
        {
            console.log('scan succeeded');
            
            var body = JSON.stringify(data.Items);
            console.log(body);
            fs.writeFile('/tmp/userdetails.txt',body,(err)=>
            {
                if(err)
                    console.log('error occured while writing data to file...'+err);
            });
    
            
        }


var objectparams = 
{
    Bucket:'loadpagebuckets3ui',
    Key: filename,
    Body: body
}
var uploadPromise = new AWS.S3({apiVersion:'2006-03-01'}).putObject(objectparams,(err,data)=>
{
    if(err)
        console.log('error came while uploading data..'+err);
    else
        console.log('The data uploaded to s3 bucket is :'+data);
}).promise();

uploadPromise.then((data)=>
{
    console.log("File uploaded successfully to s3 bucket");
}).catch((err)=>
{
    console.log("file not uploaded.."+err);
});

});
}