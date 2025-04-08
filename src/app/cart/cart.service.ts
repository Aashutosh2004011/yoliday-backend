import { Op } from 'sequelize';
import { Cart } from '../../database/models/cart.model';
import { User } from '../../database/models/user.model';
import { Project } from '../../database/models/project.model';
import { ProjectImage } from '../../database/models/projectImage.model';

export interface CreateCartDto {
  userId: string;
  projectId: string;
  quantity: number;
}

export interface UpdateCartDto {
  quantity?: number;
}

export interface CartQuery {
  search: string;
  userId?: string;
  projectId?: string;
  sortBy?: keyof Cart;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

class CartService {

  async createCart(cartData: CreateCartDto): Promise<Cart> {
    console.log('cartData: ', cartData);
    try {
      const existingCartItem = await Cart.findOne({
        where: {
          userId: cartData.userId,
          projectId: cartData.projectId
        }
      });

      if (existingCartItem) {
        existingCartItem.quantity += cartData.quantity;
        await existingCartItem.save();
        return existingCartItem;
      }

      return await Cart.create({
        userId : cartData.userId,
        projectId : cartData.projectId,
        quantity : cartData.quantity
      });
    } catch (error) {
      throw error;
    }
  }

  async getCarts(query: CartQuery): Promise<PaginatedResponse<Cart>> {
    try {
      const { search, userId, projectId, sortBy = 'createdAt', sortOrder = 'DESC', limit = 10, offset = 0 } = query;
      
      const whereClause: any = {};
      const includeOptions: any[] = [
        {
          model: Project,
          include: [{ model: ProjectImage }]
        },
        { model: User }
      ];
      
      if (search) {
        includeOptions[0].where = {
          title: { [Op.like]: `%${search}%` }
        };
      }
      
      if (userId) {
        whereClause.userId = userId;
      }
      
      if (projectId) {
        whereClause.projectId = projectId;
      }
      
      const { count: total } = await Cart.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        distinct: true
      });
      
      const carts = await Cart.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: includeOptions
      });
      
      return {
        data: carts,
        total,
        limit,
        offset
      };
    } catch (error) {
      throw error;
    }
  }

  async getCartById(id: string): Promise<Cart | null> {
    try {
      return await Cart.findByPk(id, {
        include: [
          { 
            model: Project,
            include: [{ model: ProjectImage }]
          },
          { model: User }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserCart(userId: string): Promise<Cart[]> {
    try {
      return await Cart.findAll({
        where: { userId },
        include: [
          { 
            model: Project,
            include: [{ model: ProjectImage }]
          },
          { model: User }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCart(id: string, cartData: UpdateCartDto): Promise<Cart | null> {
    try {
      const cart = await Cart.findByPk(id);
      
      if (!cart) {
        return null;
      }
      
      // If quantity is set to 0 or less, remove item from cart
      if (cartData.quantity !== undefined && cartData.quantity <= 0) {
        await cart.destroy();
        return null;
      }
      
      await cart.update(cartData);
      return this.getCartById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteCart(id: string): Promise<boolean> {
    try {
      const cart = await Cart.findByPk(id);
      
      if (!cart) {
        return false;
      }
      
      await cart.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async clearUserCart(userId: string): Promise<boolean> {
    try {
      const result = await Cart.destroy({
        where: { userId }
      });
      
      return result > 0;
    } catch (error) {
      throw error;
    }
  }

  async getCartItem(userId: string, projectId: string): Promise<Cart | null> {
    try {
      return await Cart.findOne({
        where: {
          userId,
          projectId
        },
        include: [
          { 
            model: Project,
            include: [{ model: ProjectImage }]
          },
          { model: User }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  async removeFromCart(userId: string, projectId: string): Promise<boolean> {
    try {
      const result = await Cart.destroy({
        where: {
          userId,
          projectId
        }
      });
      
      return result > 0;
    } catch (error) {
      throw error;
    }
  }
}

const CartServiceInstance = new CartService();
export default CartServiceInstance;