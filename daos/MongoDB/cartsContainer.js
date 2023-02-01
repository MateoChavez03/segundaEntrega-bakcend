import fs from "fs";
import mongoose from "mongoose";

// Model Carts

const cartsColl = 'carts';

const cartsSchema = new mongoose.Schema({
    timestamp: {type: String, required: true},
    products: {type: Array, required: true}
})

const cartsDAO = mongoose.model(cartsColl, cartsSchema)

export default class CartContainerMDB{
    
    async getAll(){
        try {
            const carts = await cartsDAO.find({});
            console.log(carts);
            return carts
        } catch (error) {
            console.error(error);
            return []
        }
    }

    async saveCart() {
        try {
            const cart = await cartsDAO.create({
                timestamp: this.setDate(),
                products: [ ]
            })
            console.log(cart);
            return cart
        } catch (error) {
            throw new Error(error);
        }
    }

    async deleteById(id){
        try {
            const cartDeleted = await cartsDAO.deleteOne({_id: id})
            console.log(cartDeleted);
            return cartDeleted
        } catch (error) {
            console.log("Cart not found");
            throw new Error(error);
        }
    }

    async getById(id){
        try {
            const response = await cartsDAO.findById(id)
            console.log(response);
            return response
        } catch (error) {
            console.log("Cart not found");
            throw new Error(error)
        }
    }

    async getProdsByCartId(id){
        try {
            const cart = await this.getById(id);
            if (cart.products.length > 0) {
                console.log(cart.products);
                return cart
            } else {
                console.log("Empty cart");
                return
            }
        } catch (error) {
            console.log("Cart not found");
            throw new Error(error)
        }
    }

    async saveProdInCart(id, product) {
        try {
            const cart = await this.getById(id);
            cart.products.push(product)
            const response = await cartsDAO.updateOne({_id : id}, {products : cart.products}, {returnDocument:"after"})
            console.log(response);
            return response
        } catch (error) {
            console.log("Cart or product not found");
            throw new Error(error)
        }
    }

    async getProdInCart(cartId, productId) {
        try {
            const cart = await this.getById(cartId);
            const product = await cart.products.find(prod => prod._id == productId)
            return product;
        } catch (error) {
            throw new Error(error)
        }
    }

    async deleteProdInCart(cartId, product) {
        try {
            const cart = await this.getById(cartId);
            if (product) {
                let index = cart.products.map(element => element.id).indexOf(product.id)
                cart.products.splice(index, 1)
                let response = await cartsDAO.updateOne({_id: cartId}, {products: cart.products})
                console.log(response);
                return response
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            throw new Error(error)
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