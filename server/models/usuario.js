const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


//ROLES VALIDOS
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

//obtener el cascaron para crear esquemas

let Schema = mongoose.Schema;

//Definimos Schema

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        require: false
    }, // No es obligatorio
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    }, //Default: 'USER_ROLE
    estado: {
        type: Boolean,
        default: true
    }, //Boolean
    google: {
        type: Boolean,
        default: false
    } //Boolean
});

//Eliminar password de la informaciòn que aparece.
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

//nombre usuario, con las propiedades de usuarioSchema. 
module.exports = mongoose.model('Usuario', usuarioSchema);