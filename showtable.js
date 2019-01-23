const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB(
{
    apiVersion: '2012-10-08', region: 'localhost', endpoint: 'http://localhost:8000/shell/',
    accessKeyId: 'DEFAULT_ACCESS_KEY', secretAccessKey: 'DEFAULT_SECRET'
});

module.exports.showtable_handler = (event,context,callback)=>
{
    var body = JSON.parse(event.body);
    console.log(body);
    var params = 
    {
        TableName : 'userdetails'
    };
    console.log(params);

    dynamo.scan(params,(err,data)=>
    {
        console.log(data);
        if(err)
            console.log('error while retrieving table data..'+err);
        else    
            console.log('Here is your table..'+JSON.stringify(data.Items));
    })
}

