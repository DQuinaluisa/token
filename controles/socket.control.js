;
'uses strict'

let gestionDocs = (http) => {
    let io = require('socket.io')(http)
    const gestionDoc = { }
    io.on('connection', socket => {
        let anteriorId 
        const safeJoin = actualId => {
            //salir de una sala
            socket.leave(anteriorId)
            //salir de una sala
            socket.join(actualId)
            anteriorId = actualId
        }
        socket.on('getDoc', docId => {
            safeJoin(docId)
            socket.emit('gestionDato', gestionDoc[docId])
        }) 
        socket.on('addDoc', doc => {
            gestionDoc[doc.id] = doc

            safeJoin(doc.id)
            io.emit('gestionDatos', Object.keys(gestionDoc))
            socket.emit('gestionDato', doc)
        })
        socket.on('editDoc', doc => {
            gestionDoc[doc.id] = doc
            socket.to(doc.id).emit('gestionDato', doc)
        })
        io.emit('gestionDatos', Object.keys(gestionDoc))
    })
} 

module.exports = gestionDocs