const mongoose = require('mongoose');


const dbConnection = async() => {

    try {

        mongoose.connect(process.env.DB_CNN);

        console.log('DB Online')

    } catch (error) {
        console.log(error);
        throw new Error('error al iniciar base de datos')
    }
}

module.exports = {
    dbConnection
}