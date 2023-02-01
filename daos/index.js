import CartContainerFS from "./FileSystem/cartsContainer.js";
import ProductContainerFS from "./FileSystem/productsContainer.js";
import CartContainerMDB from "./MongoDB/cartsContainer.js";
import ProductContainerMDB from "./MongoDB/productsContainer.js";


// Choose between FileSystem and MongoDB (initially FILESYSTEM)
const DB = "FileSystem";
let products = []
let carts = []

if (DB === "FileSystem") {
    products = new ProductContainerFS('./assets/products.json');
    carts = new CartContainerFS('./assets/carts.json');
}

if (DB === "MongoDB") {
    products = new ProductContainerMDB();
    carts = new CartContainerMDB();
}

export { products, carts, DB };