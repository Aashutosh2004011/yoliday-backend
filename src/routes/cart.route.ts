import express from 'express';
import CartControllerInstance from '../app/cart/cart.controller';

const cartRouter = express.Router();

cartRouter.post('/', CartControllerInstance.addToCart.bind(CartControllerInstance));
cartRouter.get('/', CartControllerInstance.getCarts.bind(CartControllerInstance));
cartRouter.get('/:id', CartControllerInstance.getCartById.bind(CartControllerInstance));
cartRouter.put('/:id', CartControllerInstance.updateCart.bind(CartControllerInstance));
cartRouter.delete('/:id', CartControllerInstance.deleteCart.bind(CartControllerInstance));

cartRouter.get('/user/:userId', CartControllerInstance.getUserCart.bind(CartControllerInstance));
cartRouter.delete('/user/:userId/clear', CartControllerInstance.clearUserCart.bind(CartControllerInstance));

cartRouter.get('/user/:userId/project/:projectId', CartControllerInstance.getCartItem.bind(CartControllerInstance));
cartRouter.delete('/user/:userId/project/:projectId', CartControllerInstance.removeFromCart.bind(CartControllerInstance));

export default cartRouter;
