const express = require('express');

//encriptar contraseñas
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');


const app = express();

app.get('/usuario', (req, res) => {

    //parametros opcionales: Es probable que venga desde como pueda que no. 
    //manejamos los skip

    let desde = req.query.desde || 0
    desde = Number(desde);

    //manejamos los limites
    //muestra los que dice o 5 por defecto

    let limite = req.query.limite || 5
    limite = Number(limite);

    //muestra los registros con estado true.
    Usuario.find({ estado: true }, 'nombre email role estado google img') // solo mostrará los campos mencionados
        .skip(desde) //se salta 5 elementos y luego muestra los 5 siguientes.
        .limit(limite) //muestra los 5.
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //count misma condición del find, luego recibe el callback que recibe el error y el conteo de registros.
            Usuario.countDocumentsx({ estado: true }, (err, conteo) => {
                //respuesta del servicio
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })


        })
});
app.post('/usuario', (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10), // hashSync( data o campo almacenar, el nº de vueltas a aplicar al hash)
        role: body.role
    })

    //grabar los usuarios en la BD.

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

app.put('/usuario/:id', (req, res) => {

    //obtener parametro id y body.
    let id = req.params.id;
    //arreglo de todas las opciones que si se puedan actualizar.
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    // runValidators valida los compenentes que se ingresan.
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

})

app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
            estado: false
        }
        //Esta linea, borra a alguien de la base de datos de manera fisica:
        //Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //Como no queremos eliminar de manera fisica, utilizamos findByIdAndUpdate para actualizar su estado.
    //y "eliminarlo", deshabilitarlo, etc.
    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        //si viene un usuario borrado
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
})


module.exports = app;