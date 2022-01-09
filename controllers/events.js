const Evento = require('../models/Evento')

const getEventos = async (req, res) => {

const eventos = await Evento.find().populate('user', 'name')

    res.json({
        ok: true,
        eventos
    })
}

const crearEvento = async (req, res) => {

    const evento = new Evento(req.body);

    try {

        evento.user = req.uid; //asigna el usuario al evento
    
      const eventoGuardado = await evento.save();

       res.json({
           ok: true,
           evento: eventoGuardado
       })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
    
}

const actualizarEvento = async (req, res) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);
        if(!evento){
         return   res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            })
        }

if(evento.user.toString() !== uid){  //compara si el usuario del evento es el mismo que el que quiere actualizar
    return res.status(401).json({
        ok: false,
msg: 'no tiene privilegio para editar este evento'
    })
}

//en este punto ya se sabe si el usuario es el mismo del evento o no, y si es el mismo lo va dejar actualizar
const nuevoEvento = { 
    ...req.body,
    user: uid
}

const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true}); //actualiza evento

res.json({
    ok: true,
    evento: eventoActualizado
})


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
    }
}

const eliminarEvento = async (req, res) => {
    const eventoId = req.params.id;
    const uid = req.uid;

try {

    const evento = await Evento.findById(eventoId);
        if(!evento){
           return res.status(404).json({
                ok: false,
                msg: 'evento no existe por ese id'
            })
        }

if(evento.user.toString() !== uid){  //compara si el usuario del evento es el mismo que el que quiere eliminar
    return res.status(401).json({
        ok: false,
msg: 'no tiene privilegio para eliminar este evento'
    })
}

 await Evento.findByIdAndDelete(eventoId); //Elimina el evento

res.json({
    ok: true
})

    
} catch (error) {
    console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'hable con el administrador'
        })
}

}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}