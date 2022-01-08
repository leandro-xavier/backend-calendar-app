const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt')

const crearUsuario = async(req, res = express.response) => {

    const { email, password } = req.body; //cuerpo del objeto a guardar

    try {
        let usuario = await Usuario.findOne({ email }) // revisa si hay alguien con ese usuario

        if (usuario) { // si existe el usuario retorna ese error
            return res.status(400).json({
                ok: false,
                msg: 'el usuario ya existe con ese correo'
            })
        }

        usuario = new Usuario(req.body); // si no existe crea un nuevo usuario 

        //encriptar contraseña
        const salt = bcrypt.genSaltSync(); //genera la cantidad de vueltas, dejarlo el blanco genera 10 por defecto
        usuario.password = bcrypt.hashSync(password, salt) // toma la contraseña actual y la reemplaza por la encriptada

        await usuario.save() // guarda el usuario

        //generar token
        const token = await generarJWT(usuario.id, usuario.name)

        res.status(201).json({ // devuelve el usuario guardado como respuesta
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}


const revalidarToken = async(req, res) => {

    const uid = req.uid;
    const name = req.name

    //generar token
    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        token
    })
}



const loginUsuario = async(req, res) => {

    const { email, password } = req.body

    try {
        const usuario = await Usuario.findOne({ email }) // revisa si hay alguien con ese usuario

        if (!usuario) { // si no existe el usuario retorna ese error
            return res.status(400).json({
                ok: false,
                msg: 'el usuario no existe con ese email'
            })
        }
        //confirmar las contraseñas
        const validPassword = bcrypt.compareSync(password, usuario.password) // compara la contraseña con la que esta encriptada

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password incorrecto'
            })
        }

        //generar token
        const token = await generarJWT(usuario.id, usuario.name)

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }

}



module.exports = {
    crearUsuario,
    revalidarToken,
    loginUsuario
}