import express from 'express'
import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { Mesagges } from './MesaggesSystem.js'
import { ClienteSql } from './sql/sqlClient.js'
import { mariaDB } from './options/mariaDB.js'

const apiMensajes = new Mesagges();
const apiProductos = new ClienteSql(mariaDB);
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
    socket.emit("mensajes", apiMensajes.getAll());

    socket.on("mensajeNuevo", ({ email, text }) => {
        const message = { email, text, timestamp:getTimestamp() };
        apiMensajes.save(message);

    io.sockets.emit("mensajes", apiMensajes.getAll());
});

socket.emit("products",  cargaInicial());
   
  socket.on("add-product", async (data) => {
    const products = await apiProductos.save(data);
    io.sockets.emit("products", products);
  });

});

const server = httpServer.listen(port, () => {
    console.log(`Servidor escuchando en puerto ${port}`);
});

server.on("error", (error) => {
    console.error(`Error en el servidor ${error}`);
});

function cargaInicial() {

    const productosInicial = [
        {
          title: "iPhoneX",
          price: 1500,
          thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iPhone_X_home-screen-512.png"
        },
        {
          title: "iMac",
          price: 6500,
          thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iMac-512.png"
        },
        {
          title: "Apple TV",
          price: 800,
          thumbnail: "https://cdn1.iconfinder.com/data/icons/apple-products-2026/512/Apple_TV__Ovladac-512.png"
        },
        {
          title: "Ipad",
          price: 1700,
          thumbnail: "https://cdn4.iconfinder.com/data/icons/apple-products-2026/512/iPad_White_Front-512.png"
        }
    ];

    const productos =[];

    apiProductos.crearTabla()
    .then(() => {
        return apiProductos.insertarProductos(productosInicial)
    })
    .then(() => {
        return apiProductos.listarProductos()
    })
    .then(rows => {
        productos.push(rows); 
        return productos; 
    })
    .catch((err) => { console.log(err); throw err })
    .finally(() => {
      console.log('carga inicial OK');
      
    });

}

