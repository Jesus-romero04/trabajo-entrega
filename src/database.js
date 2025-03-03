import mongoose from "mongoose";

// Utilizamos el metodo de mongoose para poder conectarnos a la DB
// El uso de then y catch para poder verificar la conexion.
const connection = mongoose.connect("mongodb+srv://ziku:zikupass@ecommerceropa-cluster.psckb.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerceropa-cluster")
    .then( ()=> console.log("Conexión exitosa a MongoDB Atlas")
    )
    .catch( (error) => {
        throw error
    }
);

export default connection;