
;
'use strict'

const { MongoClient } = require('mongodb'),
    {USER_DB,
     PASS_DB,
     HOST_DB,
     NAME_DB
    } = process.env,
    mongoUrl = `mongodb+srv://${USER_DB}:${PASS_DB}@${HOST_DB}/${NAME_DB}?retryWrites=true&w=majority`
    let connection 
    let connectDb = async() => {
        if(connection) return connection
        let cliente 
        try {
            cliente = await MongoClient.connect(mongoUrl, {
                useUnifiedTopology: true,
                useNewUrlParser: true
            })
            connection = cliente.db(NAME_DB)
            console.log('DB conectada')
        }
        catch (error){
            console.log(error)
            process.exit(1)
        }
        return connection
    }

module.exports = connectDb;