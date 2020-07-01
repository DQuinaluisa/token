;
'use estrict'

const express = require('express')
multiParty = require('connect-multiparty')

let api = express.Router(),
    filesControl = require('../controles/files.control'),
    galeriaMiddlaware = multiParty({ uploadDir: './files/galeria' }),
    pdfMiddlaware = multiParty({ uploadDir: './files/pdf' })


//ENDPOINT USUARIOS
api.post('/upload_galeria', galeriaMiddlaware, filesControl.uploadFile)
api.post('/upload_pdf', pdfMiddlaware, filesControl.uploadFile)
api.get('/file_galeria/:urlFile', filesControl.verFileGaleria)
api.put('/eliminar_imagen/:urlFile', filesControl.eliminarArchivo)


module.exports = api