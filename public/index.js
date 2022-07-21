const socket = io.connect();

function enviarMensaje() {
  const email = document.getElementById("email");
  const mensaje = document.getElementById("mensaje");

  if (!email.value || !mensaje.value) {
    alert("Debe completar los campos");
    return false;
  }

  socket.emit("mensajeNuevo", { email: email.value, text: mensaje.value });
  mensaje.value = "";
  return false;
}

socket.on("mensajes", (mensajes) => {
  let mensajesHtml = mensajes
    .map(
      (mensaje) =>
        `<span>${mensaje.email} ${mensaje.timestamp} <b>${mensaje.text}</b></span>`
    )
    .join("<br>");

  document.getElementById("mesaggesWall").innerHTML = mensajesHtml;
});

const createProductView = async (products) => {
  const template = await (await fetch("views/vistaProductos.hbs")).text();
  const templateCompiled = Handlebars.compile(template);
  return templateCompiled({ products });
};

const addProduct = () => {
  const title = document.getElementById("title");
  const price = document.getElementById("price");
  const thumbnail = document.getElementById("thumbnail");

  if (!title.value || !price.value) {
    alert("Debe completar los campos para agregar un producto");
  }

  socket.emit("add-product", {
    title: title.value,
    price: price.value,
    thumbnail: thumbnail.value,
  });
  title.value = "";
  price.value = "";
  thumbnail.value = "";
};

document.getElementById("add-product").addEventListener("click", addProduct);

socket.on("products", async (products) => {
  const template = await createProductView(products);
  document.getElementById("productsView").innerHTML = template;
});