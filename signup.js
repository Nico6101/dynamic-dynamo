const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB(
{
    endpoint: 'http://localhost:8001/shell/'
});   

module.exports.signup = async (event, context, callback) => {
    
    var data = JSON.parse(event.body);
    console.log(data.name);
    var params =
    {
        TableName: 'signup',
        Item: { name: {S : data.name} , email: {S:data.email} , mobileno: {S: data.mobileno} , password: {S: data.password} }
    };

    const putitemresponse = await dynamo.putItem(params,(err, data) =>
    {
        console.log('data to be inserted :' + JSON.stringify(data));
        if (err) 
        {
            console.log("err",err);
            return{
                statusCode: 500,
                body: JSON.stringify({ message: err })
            }
        }
        else 
        {
            return{
                statusCode: 200,
                body: JSON.stringify({ message: data })
            }
        }
    }).promise();

    var scanparams =
    {
        TableName: 'signup'
    };

    const scanresponse = await dynamo.scan(scanparams, (err, data) => 
    {
        console.log(JSON.stringify(data));

        if (err)
            console.log('unable to scan the table because ' + err);
        else 
        {
            console.log('scan succeeded');

            var body = JSON.stringify(data.Items);
            console.log(body);
            return 'scan complete';
        }
    }).promise();


    if(putitemresponse!== undefined)
    {
        console.log(JSON.stringify(putitemresponse));
        return{
            statusCode:200,
            body: JSON.stringify('insertion done..'+putitemresponse)
        }
    }
    else
    {
        return{
            statusCode: 200,
            body: '{insertion not done}'
        }
    }    
}