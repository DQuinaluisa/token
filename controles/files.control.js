;
'use strict'

const connectDb = require('../config/db'),
    fs = require('fs'),
    path = require('path');
const { ObjectId } = require('mongodb');


let uploadFile = async (req, res) => {
    let db = await connectDb()
    let file = req.files.calculos
    console.log(file)
    if (file.originalFilename == "" || !file.originalFilename) {
        fs.unlinkSync(file.path)
        return res.status(400).json({
            transaccion: false,
            data: null,
            msg: 'No existe'
        })
    } else {

        let url = file.path
        url = url.split('/')
        let urlFile = url[url.length - 1]
        console.log(urlFile)
        db.collection('galeria').insertOne({ 'nombre': file.originalFilename })
            .then(data => {
                res.status(200).json({
                    transaccion: true,
                    data,
                    msg: 'listo'
                })
            }).catch(err => {
                res.status(500).json({
                    transaccion: false,
                    data: null,
                    msg: err
                })
            })
    }
}


/*
let actualizarArchivo = async (req, res) => {
    let db = await connectDb();
    let file = req.files.file,
        id = new ObjectId(req.body.id)
        db.collection("archivos").find({'_id': id}).toArray()
        .then(data => {

        })

    db.collection("archivos").updateOne({ '_id': id }, { $set: { 'nombre': file.originalFilename } })
        .then((data) => {
            res.status(200).json({
                transaction: true,
                data,
                msg: "datos actualizados...",
            });
        })
        .catch((err) => {
            res.status(500).json({
                transaction: false,
                data: null,
                msg: "Archivos no actualizados ",
            });
        });
};
*/

let eliminarArchivo = async (req, res) => {
    let db = await connectDb(),
        id = new ObjectId(req.body.id)
    db.collection('galeria').deleteOne({ '_id': id })
        .then(data => {
            res.status(200).json({
                transaccion: true,
                data,
                msg: 'listo'
            })
        }).catch(err => {
            res.status(500).json({
                transaccion: false,
                data: null,
                msg: ''
            })
        })

}


let verFileGaleria = (req, res) => {
    let urlFile = req.params.urlFile
    let pathfile = `./files/galeria/${urlFile}`
    fs.exists(pathfile, (exists) => {

        if (exists) {
            return res.status(200).sendFile(path.resolve(pathfile))
        } else {
            return res.status(400).send('No existe')
        }
    })
}



module.exports = {
    uploadFile,
    verFileGaleria,
    eliminarArchivo

}
