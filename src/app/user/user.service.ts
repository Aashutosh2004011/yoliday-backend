import { Op } from 'sequelize';
import { User } from './../../database/models/user.model';
import { Role } from './../../database/models/role.model';
import { Project } from './../../database/models/project.model';
import { Cart } from './../../database/models/cart.model';
import * as bcrypt from 'bcrypt';

// Interfaces for type safety
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: string;
  profile_image?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  profile_image?: string;
}

export interface UserQuery {
  search?: string;
  role?: string;
  sortBy?: keyof User;
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


export interface PaginatedResponseDropdown<T> {
  data: T[];
  total: number;
}

class UserService {
  /**
   * Hash a password
   * @private
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDto): Promise<User> {
    try {
      // Check if user with same email already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error(`User with email "${userData.email}" already exists`);
      }
      
      // Hash the password before storing
      const hashedPassword = await this.hashPassword(userData.password);
      
      // Create user with hashed password
      return await User.create({
        ...userData,
        password: hashedPassword
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users with pagination, sorting and searching
   */
  async getUsers(query: UserQuery): Promise<PaginatedResponse<User>> {
    try {
      const { search, role, sortBy = 'createdAt', sortOrder = 'DESC', limit = 10, offset = 0 } = query;
      
      const whereClause: any = {};
      
      // Apply search filter if provided
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ];
      }
      
      // Apply role filter if provided
      if (role) {
        whereClause.role = role;
      }
      
      // Get total count for pagination
      const total = await User.count({ where: whereClause });
      
      // Get users with filtering, sorting, and pagination
      const users = await User.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: [
          { model: Role, as: 'roleDetails' },
          { model: Project, as: 'projects' },
          { model: Cart, as: 'cart' }
        ],
        attributes: { exclude: ['password'] } // Exclude password from results
      });
      
      return {
        data: users,
        total,
        limit,
        offset
      };
    } catch (error) {
      throw error;
    }
  }

  async getUsersDropdown(): Promise<PaginatedResponseDropdown<User>> {
    try {
      
      const total = await User.count();
      
      const users = await User.findAll({
        attributes: { exclude: ['password'] }
      });
      
      return {
        data: users,
        total,
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await User.findByPk(id, {
        include: [
          { model: Role, as: 'roleDetails' },
          { model: Project, as: 'projects' },
          { model: Cart, as: 'cart' }
        ],
        attributes: { exclude: ['password'] } // Exclude password from results
      });
      
      if (!user) {
        return null;
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { email },
        include: [
          { model: Role, as: 'roleDetails' },
          { model: Project, as: 'projects' },
          { model: Cart, as: 'cart' }
        ],
        attributes: { exclude: ['password'] } // Exclude password from results for security
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user with password (for authentication)
   */
  async getUserWithPasswordByEmail(email: string): Promise<User | null> {
    try {
      return await User.findOne({
        where: { email },
        include: [{ model: Role, as: 'roleDetails' }]
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user by ID
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<User | null> {
    try {
      const user = await User.findByPk(id);
      
      if (!user) {
        return null;
      }
      
      // If updating email, check if new email already exists
      if (userData.email && userData.email !== user.email) {
        const existingUser = await User.findOne({ where: { email: userData.email } });
        if (existingUser) {
          throw new Error(`User with email "${userData.email}" already exists`);
        }
      }
      
      // Hash password if provided
      if (userData.password) {
        userData.password = await this.hashPassword(userData.password);
      }
      
      await user.update(userData);
      
      // Fetch updated user with associations but without password
      const updatedUser = await User.findByPk(id, {
        include: [
          { model: Role, as: 'roleDetails' },
          { model: Project, as: 'projects' },
          { model: Cart, as: 'cart' }
        ],
        attributes: { exclude: ['password'] }
      });
      
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string): Promise<boolean> {
    try {
      const user = await User.findByPk(id);
      
      if (!user) {
        return false;
      }
      
      await user.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users by role ID
   */
  async getUsersByRole(roleId: string): Promise<User[]> {
    try {
      return await User.findAll({
        where: { role: roleId },
        include: [
          { model: Role, as: 'roleDetails' },
          { model: Project, as: 'projects' },
          { model: Cart, as: 'cart' }
        ],
        attributes: { exclude: ['password'] }
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Verify password
   */
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

const UserServiceInstance = new UserService();
export default UserServiceInstance;