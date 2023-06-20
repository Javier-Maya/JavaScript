class Producto{
    constructor(name, id, type, price, stock, description){
        this.name = name;
        this.id = id;
        this.type = type;
        this.price = price;
        this.stock = stock;
        this.description = description;
    }
}

// Array de productos base
const productosBase = [
    {name:"Cenicero", id:"001", type:"Accesorios", price:2990, stock:10, description:"Cenicero U. de Chile"},
    {name:"Lampara", id:"002", type:"Decoracion", price:20990, stock:5, description:"Lampara U. de Chile"},
    {name:"Mate", id:"003", type:"Vasos y Schoperos", price:9990, stock:15, description:"Mate U. de Chile"},
    {name:"Pelota", id:"004", type:"Balones", price:19990, stock:8, description:"Pelota U. de Chile"},
    {name:"Schopero", id:"005", type:"Vasos y Schoperos", price:8990, stock:12, description:"Schopero U. de Chile"},
    {name:"Termo", id:"006", type:"Tazones y Botellas", price:29990, stock:18, description:"Termo U. de Chile"}
]

// OR lógico para cargar localStorage
const productos = JSON.parse(localStorage.getItem("productos")) || [] 
let carrito = JSON.parse(localStorage.getItem("carrito")) || []
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || []

// La función agregarProducto verifica si ya existe un producto con el mismo ID en el arreglo productos. Si no existe, crea un nuevo objeto Producto, lo agrega al arreglo productos, guarda el nuevo arreglo en el almacenamiento local y muestra un mensaje de éxito en la consola. Si ya existe un producto con el mismo ID, muestra una advertencia en la consola.
const agregarProducto = ({ name, id, type, price, stock, description }) => {
    const productoExistente = productos.find(prod => prod.id === id);
    if(productos.some(prod=>prod.id===id)){
        console.warn("Ya existe un producto con ese id")
    } else {
        const productoNuevo = new Producto(name, id, type, price, stock, description);
        productos.push(productoNuevo);
        // Guarda el nuevo arreglo de productos
        localStorage.setItem("productos", JSON.stringify(productos));
        console.log("Producto agregado:", productoNuevo);
    }
};

// Esta función permite llenar el arreglo productos con productos preexistentes del arreglo productosBase solo si el arreglo productos está vacío. La copia del objeto se realiza para evitar efectos secundarios al agregar los productos al arreglo.
const productosPreexistentes = () => {
    // Verifica si el arreglo de productos está vacío
    if (productos.length===0){
        // Itera sobre los productos preexistentes en el array productosBase
        productosBase.forEach(prod => {
            // Hace una copia del producto utilizando JSON.parse y JSON.stringify
            let copia = JSON.parse(JSON.stringify(prod))
            // Agrega el producto copiado al arreglo de productos utilizando la función agregarProducto
            agregarProducto(copia);
        });
    }
};

// Calcula el total del carrito sumando el precio total de cada producto multiplicado por la cantidad correspondiente. El resultado final se devuelve como el valor de retorno de la función.
const totalCarrito = () => {
    let total = carrito.reduce((acumulador, { price, quantity }) => {
        return acumulador + (price * quantity)
    }, 0)
    return total
}

// Calcula el total del carrito utilizando la función totalCarrito y actualiza el contenido del elemento "carritoTotal" en el HTML con el precio total del carrito. Esto permite mostrar dinámicamente el precio total actualizado en la interfaz de usuario.
const totalCarritoRender = ()=>{
    const carritoTotal = document.getElementById("carritoTotal")
    carritoTotal.innerHTML=`Precio total: $ ${totalCarrito()}`
}

// Recibe un objeto y lo agrega al carrito. Luego, invoca la función totalCarritoRender para mostrar el total actualizado del carrito en la interfaz de usuario. Esto permite que, al agregar un producto al carrito, el total se actualice automáticamente en la pantalla.
const agregarCarrito = (objetoCarrito) => {
    // agrega productos al carrito
    carrito.push(objetoCarrito)
    totalCarritoRender()
}

const renderizarCarrito = () => {
    // Obtiene la referencia al elemento en el HTML donde se mostrará el carrito
    const listaCarrito = document.getElementById("listaCarrito");  
    // Borra el contenido existente del carrito para evitar duplicados
    listaCarrito.innerHTML = "";
    // Itera sobre cada elemento del carrito
    carrito.forEach(({ name, price, quantity, id }) => {
        // Se crea un nuevo elemento li para representar el producto en el carrito
        let elementoLista = document.createElement("li");
        // Se establece el atributo data-id en el elemento li. Esto se utiliza posteriormente para identificar el elemento en caso de que ya exista en el carrito.
        elementoLista.setAttribute("data-id", id);
        // Se busca si ya existe un elemento con el mismo ID
        const elementoExistente = listaCarrito.querySelector(`li[data-id="${id}"]`);
        // Si se encuentra un elemento existente, se actualiza la cantidad sumando la cantidad actual del elemento con la nueva cantidad
        if (elementoExistente) {
            const cantidadElemento = elementoExistente.querySelector(".cantidad");
            let cantidadActual = parseInt(cantidadElemento.textContent);
            let nuevaCantidad = cantidadActual + quantity;
            cantidadElemento.textContent = nuevaCantidad;
        } 
        //Si no se encuentra un elemento existente con el mismo ID, se agrega el nuevo elemento li al carrito.
        else {
            // Agrega el nuevo elemento li al carrito
            let elementoLista = document.createElement("li");
            elementoLista.innerHTML = `Producto: ${name} -- P/u: ${price} -- Cant.: <span class="cantidad">${quantity}</span> <button id="eliminarCarrito${id}">X</button>`;
            elementoLista.setAttribute("data-id", id);
            listaCarrito.appendChild(elementoLista);
        } 
        // Obtiene una referencia al botón de eliminar del producto actual
        const botonBorrar = document.getElementById(`eliminarCarrito${id}`)
        // Agrega un event listener al botón de eliminar para borrar el producto del carrito
        botonBorrar.addEventListener("click", () => {
            // Filtra el carrito para crear un nuevo arreglo sin el elemento a borrar
            carrito = carrito.filter((elemento) => elemento.id !== id);
            // Convierte el nuevo arreglo de carrito a una cadena JSON
            let carritoString = JSON.stringify(carrito);
            // Guarda el nuevo carrito en el almacenamiento local
            localStorage.setItem("carrito", carritoString);
            // Se ejecuta para actualizar el precio total del carrito
            totalCarritoRender();
            // Vuelve a renderizar el carrito actualizado
            renderizarCarrito();
        });       
        // Convierte el carrito actual a una cadena JSON
        let carritoString = JSON.stringify(carrito);
        // Guarda el carrito en el almacenamiento local
        localStorage.setItem("carrito", carritoString);
    })
}
  
// Esta función asignará un nuevo array vacío a la variable carrito, lo cual borrará el contenido del carrito.
const borrarCarrito = ()=>{
    carrito.length = 0;  //es una manera de borrar el contenido de un array constante
    // Se convierte el array carrito en una cadena JSON
    let carritoString = JSON.stringify(carrito);
    // Se guarda la cadena JSON del carrito en el localStorage.
    localStorage.setItem("carrito", carritoString);
    // Se llama a la función renderizarCarrito() para actualizar la visualización del carrito en el HTML después de haber borrado su contenido
    renderizarCarrito();
}

const renderizarProductos = (arrayUtilizado)=>{
    // renderiza productos en el DOM
    const contenedorProductos = document.getElementById("contenedorProductos")
    // borramos para no duplicar
    contenedorProductos.innerHTML = ""
    arrayUtilizado.forEach(({name, id, type, price, stock, description})=>{
        const prodCard = document.createElement("div")
        prodCard.classList.add("col-xs")
        prodCard.classList.add("card")
        prodCard.style = "width: 270px;height: 550px; margin:3px"
        prodCard.id = id
        prodCard.innerHTML = `
                <img src="../assets/${name}.png" class="card-img-top" alt="${name}">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <h6>${type}</h6>
                    <p class="card-text">${description}</p>
                    <span>Stock: ${stock}</span>
                    <span>$ ${price}</span>
                    <form id="form${id}">
                        <label for="contador${id}">Cantidad</label>
                        <input type="number" placeholder="0" id="contador${id}">
                        <button class="btn btn-primary" id="botonProd${id}">Agregar</button>
                    </form>
                </div>`
        contenedorProductos.appendChild(prodCard)
        const btn = document.getElementById(`botonProd${id}`)
        // Funcionalidad al boton de agregar para agregar productos al carrito
        btn.addEventListener("click",(e) => {
            e.preventDefault()
            // Obtenemos la cantidad seleccionada
            const contadorQuantity = Number(document.getElementById(`contador${id}`).value)
            if(contadorQuantity>0){
                // Agregamos el producto al carrito
                agregarCarrito({name, id, type, price, stock, description, quantity:contadorQuantity})
               
                // Renderizamos el carrito actualizado
                renderizarCarrito()

                // Reiniciamos el formulario
                const form = document.getElementById(`form${id}`)
                form.reset()
            }
        })
    })
}

const finalizarCompra = (event) => {
    // como conseguir todos los datos de un form
    // conseguimos la data de la form
    const data = new FormData(event.target)
    // creamos un objeto que sea {nombreInput: valorInput,...}
    const cliente = Object.fromEntries(data)
    // Creamos un "ticket"
    const ticket = {cliente: cliente, total:totalCarrito(),id:pedidos.length, productos:carrito} //idealmente le ponen id único mejor que este
    pedidos.push(ticket)
    // Guardamos el ticket en nuestra "base de datos"
    localStorage.setItem("pedidos", JSON.stringify(pedidos))
    // Borra el array y le da un mensaje al usuario
    borrarCarrito()
    let mensaje = document.getElementById("carritoTotal")
    mensaje.innerHTML = "Muchas gracias por su compra, los esperamos pronto"
}

// DOM
const compraFinal = document.getElementById("formCompraFinal")
compraFinal.addEventListener("submit",(event)=>{
    // evitamos el reset
    event.preventDefault()
    if(carrito.length>0){
        finalizarCompra(event)
    } else {
        // console.warn("canasta vacia") // no para esta entrega, lo ahcemos a futuro con lirberias
    }
    compraFinal.reset(); // Borra los datos del formulario
})

const selectorTipo = document.getElementById("tipoProducto")
selectorTipo.onchange = (evt) => {
    const tipoSeleccionado =  evt.target.value
    if(tipoSeleccionado === "0"){
        renderizarProductos(productos)
    } else {
        renderizarProductos(productos.filter(prod=>prod.type === tipoSeleccionado))
    }
}

const app = () => {
    productosPreexistentes()
    renderizarProductos(productos)
    renderizarCarrito()
    totalCarritoRender()
}

app()