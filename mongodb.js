const {MongoClient,ObjectID} = require('mongodb')
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'fundase'

MongoClient.connect(connectionURL,
    {useNewUrlParser:true,useUnifiedTopology: true},
    (err,client)=>{
        if(err){
            return console.log(err.message)
        }

        const db = client.db(databaseName)

        db.collection('users').insertOne({
            name:'rona',
            age:27
        },(error,result)=>{
            if(error){
                return console.log('Terjadi Kesalahan')
            }
        })
    })