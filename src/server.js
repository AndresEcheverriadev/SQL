import express from 'express'
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { FileSystem } from './sql/FileSystem.js'
import { MesaggeSystem } from './sql/MesaggeSystem.js'
import { mariaDB } from './options/mariaDB.js'
import { Sqlite } from './options/SQLite3.js'

const apiMensajes = new MesaggeSystem(Sqlite);
const apiProductos = new FileSystem(mariaDB);
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const port = 8080;
app.use(express.static('public'));

const getTimestamp = () => {
    const date = new Date();
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};


io.on('connection', async (socket)=> {
    console.log(`Cliente conectado en ${socket.id}`);

    socket.emit("mensajes",await apiMensajes.listarMensajes());

    socket.on("mensajeNuevo", async ({ email, texto }) => {
        const message = { email, texto, timestamp:getTimestamp() };
        await apiMensajes.insertarMensaje(message);
        io.sockets.emit("mensajes",await apiMensajes.listarMensajes());
    });

    socket.emit("products", await apiProductos.listarProductos());
   
    socket.on("add-product", async (data) => {
      const products = await apiProductos.insertarProductos(data);
      io.sockets.emit("products", products);
      socket.emit("products", await apiProductos.listarProductos());
    });

});

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});

server.on("error", (error) => {
    console.error(`Error en el servidor ${error}`);
});



// const productosInicial = [
// {
//     title: "iPhoneX",
//     price: 1500,
//     thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iPhone_X_home-screen-512.png"
// },
// {
//     title: "iMac",
//     price: 6500,
//     thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iMac-512.png"
// },
// {
//     title: "Apple TV",
//     price: 800,
//     thumbnail: "https://cdn1.iconfinder.com/data/icons/apple-products-2026/512/Apple_TV__Ovladac-512.png"
// },
// {
//     title: "Ipad",
//     price: 1700,
//     thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iPad_White_Front-512.png"
// }
// ];

