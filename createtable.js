const AWS = require('aws-sdk');
AWS.config.update({
    endpoint: "http://localhost:8001/shell/"
  });
  
const dynamodb = new AWS.DynamoDB();

module.exports.createtable_handler = async (event,context,callback)=>
{
    function paramfunc()
    {
        return new Promise(async (resolve,reject)=>
        {
            
            var tablename = JSON.parse(event.body);
            console.log(tablename);
            var schemaparams = 
            {
                TableName : tablename.name,
                KeySchema : 
                [{
                    AttributeName : tablename.hashkey,
                    KeyType : 'HASH'
                }],
                AttributeDefinitions :
                [{
                    AttributeName : tablename.hashkey,
                    AttributeType : 'S'
                }],
                ProvisionedThroughput :
                {
                    ReadCapacityUnits : 1,
                    WriteCapacityUnits : 1
                }        
            }

            function createtablefunc()
            {
                return new Promise((resolve,reject)=>
                {
                    dynamodb.createTable(schemaparams,(err,data)=>
                    {
                        if(err)
                        {
                            console.log('Error came while creating table...'+err);
                            var response = 
                            {
                                statusCode : 500,
                                body : JSON.stringify({message : err})
                            }
                            callback(response,null);
                            resolve('table creation failed');
                        }
                        else
                        {
                            console.log('Table successfully created..'+data);
                            var response =
                            {
                                statusCode : 200,
                                body : JSON.stringify({message: data})
                            }
                            callback(null,response);
                            resolve('actual table creation success');
                        }
                    });
                });
            }
            const createtablefuncresponse = await createtablefunc();
            console.log('createtablefunc executed : '+createtablefuncresponse);
            resolve('schema params = '+JSON.stringify(schemaparams));
            
        });
    }
    const paramfuncresponse = await paramfunc();     
    console.log('paramfunc executed : '+paramfuncresponse);
    return;
}