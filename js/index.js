const establecimiento = "Bizzco Bakery";

console.log(`¡Bienvenido a ${establecimiento}!`);

let clientes = [];

let nombre = prompt("Ingresa tu nombre completo");
let telefono = prompt("Ingresa tu numero de telefono");
let direccion = prompt("Ingresa tu direccion");

let cliente = {
    nombre: nombre,
    telefono: telefono,
    direccion: direccion
};

clientes.push(cliente);

console.log("Datos del cliente:", cliente);

//Productos disponibles
const productos = [
    {id: 1, nombre: "Cookies Red velvet", precio: 2500},
    {id: 2, nombre: "Cookies Carrot cake", precio: 3000},
    {id: 3, nombre: "Cookies Pistachio", precio: 3500},
    {id: 4, nombre: "Cookies Doble chocolate", precio: 2000}
];

console.log("Productos disponibles:");
productos.forEach(producto => {
    console.log(`${producto.id}. ${producto.nombre} -$${producto.precio}`);
});

//Seleccion de productos y cantidad por el cliente
let productosSeleccionados = [];

for (let i = 0; i < productos.length; i++) {
    let cantidad = parseInt(prompt(`¿Cuantos ${productos[i].nombre} deseas comprar?`));

    //solo agregamos el producto si la cantidad es mayor a 0
    if (cantidad > 0){
        productosSeleccionados.push({
            producto: productos[i],
            cantidad: cantidad
        });
    }
}

console.log("Productos seleccionados:");
productosSeleccionados.forEach(item => {
    console.log(`${item.cantidad} x ${item.producto.nombre} - $${item.producto.precio * item.cantidad}`);
})

//Funcion para calcular el total

function calcularTotal(productosSeleccionados) {
    let total = 0;
    productosSeleccionados.forEach(item => {
        total += item.producto.precio * item.cantidad;
    });

    //Verificar si se aplica descuento

    if (productosSeleccionados.length > 2 || productosSeleccionados.some(item => item.cantidad > 2)) {
        console.log("¡Felicidades! Se ha aplicado un descuento del 15%. ");
        total *= 0.85;
    }
    return total;
}

//Total de la compra
let totalCompra = calcularTotal(productosSeleccionados);

console.log("Total de la compra (sin IVA): $" + totalCompra);

//Calcular Iva 
let iva = totalCompra * 0.21;
console.log("IVA (21%): $" + iva);

//Total con IVA
let totalConIva = totalCompra + iva;
console.log("Total con IVA: $" + totalConIva);

// Mostrar el resumen de la compra
console.log("\nResumen de tu compra:");
console.log(`Nombre: ${cliente.nombre}`);
console.log(`Teléfono: ${cliente.telefono}`);
console.log(`Dirección: ${cliente.direccion}`);
console.log("Productos comprados:");
productosSeleccionados.forEach(item => {
  console.log(`${item.cantidad} x ${item.producto.nombre} - $${item.producto.precio * item.cantidad}`);
});
console.log("Total sin IVA: $" + totalCompra);
console.log("IVA: $" + iva);
console.log("Total con IVA: $" + totalConIva);
