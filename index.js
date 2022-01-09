const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./databases/config');
require('dotenv').config();

const app = express()

//base de datos

dbConnection();

//CORS
app.use(cors());

//directorio publico

app.use(express.static('public'));

//lectura y parseo del body

app.use(express.json());

//rutas

app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

//escuchar el puerto

app.listen(process.env.PORT, () => {
    console.log(`server on port ${process.env.PORT}`)
})