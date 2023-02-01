import mongoose from "mongoose";

// Model Products

const productsColl = 'products';

const productsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    code: {type: String, required: true},
    url: {type: String, required: true},
    price: {type: Number, required: true},
    stock: {type: Number},
    timestamp: {type: String, required: true}
})

export const productsDAO = mongoose.model(productsColl, productsSchema)

export default class ProductContainerMDB{

    async getAll(){
        try {
            const products = await productsDAO.find({});
            console.log(products);
            return products
        } catch (error) {
            console.error(error);
            return []
        }
    }

    async update(product, id){
        try {
            const oldProduct = await this.getById(id);
            if (oldProduct) {
                const newProduct = await productsDAO.findByIdAndUpdate(id, product, {returnDocument:'after'})
                console.log(`New Product: \n${newProduct} \nOld Product: \n${oldProduct}`);
                return [newProduct, oldProduct]
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.error(error);
            return []
        }
    }

    async saveProduct(product) {
        try {
            product.timestamp = this.setDate()
            const response = await productsDAO.create(product)
            console.log(response);
            return response
        } catch (error) {
            throw new Error(error);
        }
    }

    async getById(id){
        try {
            const response = await productsDAO.findById(id)
            console.log(response);
            return response
        } catch (error) {
            console.log("Product not found");
            throw new Error(error)
        }
    }

    async deleteById(id){
        try {
            const productDeleted = await productsDAO.deleteOne({_id: id})
            console.log(productDeleted);
            return productDeleted
        } catch (error) {
            console.log("Product not found");
            throw new Error(error);
        }
    }
    
    setDate() {
        let today = new Date();
        let minutes = today.getMinutes();
        if (minutes < 10) {
            minutes = `0${today.getMinutes()}`
        }
        let date = `${today.getFullYear()}-${(today.getMonth()+1)}-${today.getDate()} ${today.getHours()}:${minutes}`;
        return date
    }
}
