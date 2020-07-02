;
'use strict'

const jwt = require('jsonwebtoken')
const storage = require('session-storage')
const cache = require('memory-cache')
     
    

/*let autentica = (req, res, next) => {
    
    let token = req.headers.authorization || null
    console.log(token)
    
  jwt.verify(token, process.env.KEY_JWT, (err, decode) => {
        if(err) {
            return res.status(400).json({
                data : err,
                msg: 'Token invalido'
            }) 
        }else {
            req.decode = decode
            
            let token = jwt.sign({data: decode.data}, process.env.KEY_JWT, {
                algorithm: 'HS256',
                expiresIn: parseInt(process.env.TIEMPO)

            })
           
            req.token = token
            next()
        }
    })
}*/


let autentificar = (req, res, next) =>  {
    let token = req.headers.authorization || null; 
    console.log(token)
    console.log(cache.get( 'passw' ))
    jwt.verify(token, process.env.KEY_JWT, (err, decode) =>{
        if(err){
            return res.status(400).json({
                transaction: false,
                data: null,
                msg: err
            })
        }
        req.decode = decode
        console.log(decode)
        let token = jwt.sign({data: decode.data}, req.sessionID, {
            algorithm: 'HS256', 
            expiresIn: parseInt(process.env.TIEMPO)
        })
        req.token = token
        next()

        
    })
}



module.exports = {
   //  autentica
  autentificar
}
