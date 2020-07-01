;
'use strict'

const env = require('dotenv').config(),
    app = require('./app'),
    port = process.env.PORT || 3000

app.listen(port, (err) => {
    if (!err) {
        console.log(`El servicio esta funcionando en el puerto http://localhost:${port}`)
    } else {
        console.log("el servicio no esta funcionando")
    }
})