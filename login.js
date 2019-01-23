const AWS = require('aws-sdk');

const dynamo = new AWS.DynamoDB.DocumentClient({endpoint: 'http://localhost:8001/shell/'});

module.exports.login = (event,context,callback)=>
{
    var body = JSON.parse(event.body);
    console.log(body);
    console.log(body.name);
    console.log(body.password);
    var params =
    {
        TableName : 'userdetails',
        KeyConditionExpression:'#name = :bodyname',        
        ExpressionAttributeNames:
        {'#name':'name','#password':'password'},
        ExpressionAttributeValues:
        {':bodyname': body.name,':bodypassword': body.password},
        FilterExpression: '#name=:bodyname AND #password=:bodypassword' 
    };

    dynamo.scan(params, (err,data)=>
    {
        if(err)
        {
            console.log("please sign up first."+err);
            callback("please sign up first."+err,null);
        }
        console.log(data);
        var flag = 0;
        data.Items.forEach((attribute)=>
        {   
            flag=1;
            console.log('successful login of : '+attribute.name);  
            console.log('password is :'+attribute.password);
        });      
        if(flag==0)
            console.log('please signup first');        
    });    
}