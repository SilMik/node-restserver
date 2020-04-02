//Crear variables de forma global.


//Objeto global que corre en todo el entorno de node.

process.env.PORT = process.env.PORT || 3000;


// =====================
// Entorno
// =====================

//si la variable no existe, entonces estoy en desarrollo

process.env.NODE_ENV = process.env.NODE_ENV || ' dev '

// =====================
// base de datos
// =====================

let urlDB;

if (process.env.NODE_ENV === ' dev ') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://SilMik:oEdvogqsvBjUTjJ3@cluster0-veikv.mongodb.net/cafe?retryWrites=true&w=majority'
}


process.env.URLDB = urlDB;