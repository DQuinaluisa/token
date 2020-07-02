'use strict'

const jwt = require('jsonwebtoken');

let admin = (req, res, next) => {
    let token = req.headers.authorization || null;

    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        if(err) {
            return res.status(400).json({
                data: err,
                msg: "token invalido",
            });
        } else {
            switch (decode.data.rol) {
                case "Administrador":
                    console.log('Bienvenido admin');
                    next();
                    break;
                    default:
                        res.status(401).json({
                            ok: false,
                            data: null,
                            msg: "No tienes permisos.",
                        });
            }
        }
    })
}


let cliente = (req, res, next) => {
    let token = req.headers.authorization || null;

    jwt.verify(token, process.env.JWT_KEY, (err, decode) => {
        if(err) {
            return res.status(400).json({
                data: err,
                msg: "token invalido",
            });
        } else {
            switch (decode.data.rol) {
                case "Cliente":
                    console.log('Bienvenido cliente');
                    next();
                    break;
                    default:
                        res.status(401).json({
                            ok: false,
                            data: null,
                            msg: "No tienes permisos.",
                        });
            }
        }
    })
}


module.exports = {
    admin,
    cliente
}