("use strict");

const connectDb = require("../config/db"),
    fs = require("fs"),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    storage = require('session-storage'),
    cache = require('memory-cache')
const { ObjectId } = require("mongodb");

let prueba = (req, res) => {
    res.status(200).send("Hola API");
};

let getUsuarios = async (req, res) => {
    let db = await connectDb();
    db.collection("usuarios")
        .find()
        .toArray()
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data: data,
                msg: "listo",
                token: req.token
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: err,
            });
        });
};

let insertarUno = async (req, res) => {
    let db = await connectDb();
    let data = req.body;
    db.collection("usuarios")
        .insert(data)
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data,
                msg: "datos guardados...",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: `El error es: ${err}`,
            });
        });
};

let insertarMuchos = async (req, res) => {
    let db = await connectDb();
    let personas = req.body.personas;
    db.collection("usuarios")
        .insertMany(personas)
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data,
                msg: "datos guardados...",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: `El error es: ${err}`,
            });
        });
};

let porId = async (req, res) => {
    const id = new ObjectId(req.params.id);
    let db = await connectDb();
    db.collection("usuarios")
        .findOne({ _id: id })
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data: data,
                msg: "listo",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: err,
            });
        });
};

let porNombre = async (req, res) => {
    let db = await connectDb();
    let campos = req.query.campo;
    let elemento = req.query.elemento;

    db.collection("usuarios")
        .find({ nombre: elemento })
        .toArray()
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data,
                msg: `Datos obtenidos ${data.length}`,
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: err,
            });
        });
};

let actualizarUno = async (req, res) => {
    let db = await connectDb();
    let uno = req.body;
    console.log(uno);
    db.collection("usuarios")
        .updateOne({ _id: new ObjectId(uno.id) }, { $set: uno.data })
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data,
                msg: "datos actualiazados...",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: `El error es: ${err}`,
            });
        });
};

let actualizarMuchos = async (req, res) => {
    let db = await connectDb();
    let uno = req.body;
    db.collection("usuarios")
        .updateMany({ nombre: uno.nombre }, { $set: { apellido: uno.apellido } })
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data,
                msg: "datos actualiazados...",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: `El error es: ${err}`,
            });
        });
};

let eliminar = async (req, res) => {
    const id = new ObjectId(req.params.id);
    let db = await connectDb();
    db.collection("usuarios")
        .deleteOne({ _id: id })
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data: data,
                msg: "listo",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: err,
            });
        });
};

let crearUsuario = async (req, res) => {
    let usuario = req.body.usuario
    let db = await connectDb();

    db.collection('usuarios').insertOne(usuario)
    .then(data => {
        let rol = {
            idUsuario: data.ops[0]._id,
            rol: req.body.rol
        }
        db.collection('Roles').insertOne(rol)
        .then(() =>{
            res.status(200).json({
                transaction: true,
                data,
                msg: 'Ready'
            })
        })
    })
    .catch(err => {
        res.status(400).json({
            transaction: false,
            data: null,
            msg: err
        })
    })
}

let login =  async  (req, res ) => {
    const db = await connectDb()
    let usuario = req.body.usuario  
      
    db.collection('usuarios').find({'email': usuario.email }).toArray()
    .then(data => {
        let contra =   bcrypt.compareSync(usuario.passw, data[0].passw);  
        
   // db.collection('roles').find({'id': data.id}).toArray()



        let token = jwt.sign({data: usuario.email}, process.env.KEY_JWT, {
            algorithm: 'HS256',
            expiresIn:  60 // parseInt(process.env.TIEMPO)
        })
        console.log(token)
        res.status(200).json({
            contra, 
            token
        })
        console.log(data)  
       if(contra === true ) {
            res.status(200).json({
                transaccion: true,
                data,
                msg: 'listo'
            })         
        }else {
            res.send('No estas mi so ')
        }  
    }).catch(err => {
        res.status(500).json({
            transaccion: false,
            data: null,
            msg: err
        })
    })
}

let loginUsuario = async (req, res) => {
    let db = await connectDB();
    let email = req.body.data.email
    let passw = req.body.data.passw
    if(email == "" || passw == "")
    {
        return res.status(400).send('Campos Vacios')
    } else {
        db.collection('usuarios').find({'email':email}).toArray()
        .then(data => {
            if(bcrypt.compareSync(passw, data[0].passw)){
                db.collection('Roles').find({'idUsuario': new ObjectId(data[0]._id)}).toArray()
                .then(data => {
                cache.put('passw', passw)
                     
                })
                .catch(err => {
                    return err
                })

                let usuario = {
                    email: data[0].email
                }

                let token = jwt.sign({data: usuario}, req.sessionID, {
                    algorithm: 'HS256', 
                    expiresIn: 60
                })

                return res.status(200).json({
                    transaction: true,
                    token,
                    msg: 'Loggeded'
                })
            } else {
                return res.status(400).json({
                    transaction: true,
                    data: null,
                    msg: 'Credenciales incorrectas'
                })
            }
        })
        .catch(err =>{
            return res.status(400).json({
                transaction: false,
                data: null,
                msg: err
            })
        })
    }
}


let postman = (req, res) => {
    /*
            query >>> http://localhost:3500/api/endPoint?nombre=Gabriela&apellido=Perez
                        endPoint >>> api.get('get_usuario'....)
                        req.query.nombre  req.query.apellido   req.query.edad
            
            params >>>  http://localhost:3500/api/endPoint/Gabriela/Perez/24
                        endPoint >>> api.get('get_usuario/:id')
                                     api.get('get_usuario/apellido/edad')
                        req.params.nombre   req.params.apellido    req.params.edad
            
            body >>>    http://localhost:3500/api/endPoint
                        api.post('crear_usuario', ...)
                        req.body.data
    
                        {
                            data: {
                                nombre:Gabriela,
                                apellido: Perez
                                edad: 24
                            }
                        }
    
                        req.body.nombre
    
                        {
                            nombre: gabriela,
                            apellido: perez,
                            edad. 24
                        }
        */
};

let postmanQuery = (req, res) => {
    let nombre = req.query.nombre;
    let apellido = req.query.apellido;
    let edad = req.query.edad;
    let persona = req.query;
    console.log(req.query);
    console.log(persona);
    let data = {
        nombre,
        apellido,
        edad,
    };
    res.status(200).json({
        transaction: true,
        data,
        msg: "",
    });
};

let postmanParams = (req, res) => {
    let nombre = req.params.nombre;
    let apellido = req.params.apellido;
    let edad = req.params.edad;
    let persona = req.params;
    console.log(persona);
    let data = {
        nombre,
        apellido,
        edad,
    };
    res.status(200).json({
        transaction: true,
        data,
        msg: "",
    });
};
let postmanBody = (req, res) => {
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;
    let edad = req.body.edad;
    let persona = req.body;
    console.log(persona);
    let data = {
        nombre,
        apellido,
        edad,
    };
    res.status(200).json({
        transaction: true,
        data,
        msg: "",
    });
};

module.exports = {
    prueba,
    getUsuarios,
    porId,
    porNombre,
    actualizarUno,
    actualizarMuchos,
    eliminar,
    insertarUno,
    insertarMuchos,
    crearUsuario,
    login,
    loginUsuario,
    postmanQuery,
    postmanParams,
    postmanBody,
};
