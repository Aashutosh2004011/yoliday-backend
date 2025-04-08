import { Request, Response } from 'express';
import CartServiceInstance, { CreateCartDto, UpdateCartDto, CartQuery } from './cart.service';
import { Cart } from '../../database/models/cart.model';

class CartController {

  async addToCart(req: Request, res: Response): Promise<Response> {
    try {
      const cartData: CreateCartDto = req.body;
      console.log('cartData: ', cartData);
      
      if (!cartData.userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      if (!cartData.projectId) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }
      
      if (!cartData.quantity || cartData.quantity <= 0) {
        cartData.quantity = 1; // Default to 1 if not provided or invalid
      }
      
      const cartItem = await CartServiceInstance.createCart(cartData);
      
      return res.status(201).json({
        success: true,
        data: cartItem,
        message: 'Item added to cart successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to add item to cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCarts(req: Request, res: Response): Promise<Response> {
    try {
      const query: CartQuery = {
        search: req.query.search as string | undefined,
        userId: req.query.userId as string | undefined,
        projectId: req.query.projectId as string | undefined,
        sortBy: req.query.sortBy as keyof Cart | undefined,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const carts = await CartServiceInstance.getCarts(query);
      console.log('carts: ', carts);
      
      return res.status(200).json({
        success: true,
        ...carts,
        message: carts.data.length ? 'Cart items retrieved successfully' : 'No cart items found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve cart items',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCartById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Cart ID is required'
        });
      }
      
      const cart = await CartServiceInstance.getCartById(id);
      
      if (!cart) {
        return res.status(404).json({
          success: false,
          message: `Cart item with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: cart,
        message: 'Cart item retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve cart item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserCart(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const cartItems = await CartServiceInstance.getUserCart(userId);
      
      return res.status(200).json({
        success: true,
        data: cartItems,
        message: cartItems.length ? 'User cart retrieved successfully' : 'User cart is empty'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateCart(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const cartData: UpdateCartDto = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Cart ID is required'
        });
      }
      
      if (Object.keys(cartData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No update data provided'
        });
      }
      
      const updatedCart = await CartServiceInstance.updateCart(id, cartData);
      
      if (updatedCart === null && cartData.quantity && cartData.quantity <= 0) {
        return res.status(200).json({
          success: true,
          message: 'Item removed from cart due to quantity being zero or less'
        });
      }
      
      if (updatedCart === null) {
        return res.status(404).json({
          success: false,
          message: `Cart item with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedCart,
        message: 'Cart item updated successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update cart item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteCart(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Cart ID is required'
        });
      }
      
      const isDeleted = await CartServiceInstance.deleteCart(id);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: `Cart item with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async clearUserCart(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const isCleared = await CartServiceInstance.clearUserCart(userId);
      
      return res.status(200).json({
        success: true,
        message: isCleared ? 'User cart cleared successfully' : 'User cart was already empty'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to clear user cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCartItem(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, projectId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }
      
      const cartItem = await CartServiceInstance.getCartItem(userId, projectId);
      
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in user cart'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: cartItem,
        message: 'Cart item retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve cart item',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async removeFromCart(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, projectId } = req.params;
      
      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      if (!projectId) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }
      
      const isRemoved = await CartServiceInstance.removeFromCart(userId, projectId);
      
      if (!isRemoved) {
        return res.status(404).json({
          success: false,
          message: 'Item not found in user cart'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to remove item from cart',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

const CartControllerInstance = new CartController();
export default CartControllerInstance;