const AWS = require('aws-sdk');
var date = require('date-and-time');
const createtablemodule = require('./createtable');

var now = new Date();
const currentdate = date.format(now,'YYYY/MM/DD HH:mm:ss');

const dynamo = new AWS.DynamoDB(
    { 
        endpoint: 'http://localhost:8001/shell/'
    });

module.exports.chattable_handler = async (event, context, callback) => 
{
    console.log(event.body);
    var data = JSON.parse(event.body);
    console.log('name of user1 :'+data.user1);
    console.log('name of user2 :'+data.user2);

    var tableevent =
    {
        body : JSON.stringify(                                                  //table event for creation of table of sender
        {
            name: 'chat_table_'+ data.user1,
            hashkey: 'timestamp'
        })
    };
    console.log("tableevent body:"+tableevent.body);
    
    const createtableresponse = await createtable();
    function createtable()
    {
        return new Promise((resolve,reject)=>
        {
            resolve(createtablemodule.createtable_handler(tableevent,context,callback));        //function to create table using table event
        });
    }
    var tableevent =
    {
        body : JSON.stringify(
        {
            name: 'chat_table_'+ data.user2,                                //table event for creation of table of receiver
            hashkey: 'timestamp'
        })
    };
    console.log("tableeventuser2 body:"+tableevent.body);
    
    const createtableresponseuser2 = await createtable();

    var dataparams =
    {
        TableName: 'chat_table_'+data.user1,
        Item:
        {
            timestamp : {S : currentdate},
            sentfrom: { S: data.user1 + '->' + data.user2 },                //params for insertion in sender table
            chat: { S: data.chatuser1 }
        }
    };

    console.log(createtableresponse);
    console.log(createtableresponseuser2)
    
    const putitemresponse = await dynamoputitem();
    console.log(putitemresponse);
    function dynamoputitem()
    {
        return new Promise((resolve,reject)=>
        {
            dynamo.putItem(dataparams, (err, data) => 
            {
                if (err)
                {
                    console.log("Error while inserting data.." + err);                  // Insertion in sender table
                    resolve('insertion failed');
                }
                else
                {
                    console.log("Data entered successfully.." + data);
                    resolve('insertion success');
                    return{
                        statusCode: 200,
                        body: JSON.stringify({ message: 'Data inserted successfully.' })
                    }                    
                }
            });
        });
    }

    var user2params = 
    {
        TableName : 'chat_table_'+data.user2,
        Item:
        {
            timestamp: {S: currentdate},
            sentfrom : {S : data.user1+'->'+data.user2},                    // params for insertion in receiver table
            chat : {S : data.chatuser1}
        }
    };

    const user2tableentry = await dynamo.putItem(user2params, (err, data) =>        // insertion in receiver table
    {
        if (err)
        {
            console.log("Error while inserting data.." + err);
        }
        else
        {
            console.log("Data entered successfully.." + data);
            return{
                statusCode: 200,
                body: JSON.stringify({ message: 'Data inserted successfully.' })
            }
            
        }
    }).promise();
    if(user2tableentry!== undefined)
    {
        console.log(JSON.stringify(user2tableentry));
        return{
            statusCode:200,
            body: JSON.stringify('user2entry done..'+user2tableentry)
        }
    }
    else
    {
        return{
            statusCode: 200,
            body: '{user2entry not done}'
        }
    }
    
}
