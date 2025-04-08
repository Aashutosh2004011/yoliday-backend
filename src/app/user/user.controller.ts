import { Request, Response } from 'express';
import UserServiceInstance, { CreateUserDto, UpdateUserDto, UserQuery } from './user.service';
import RoleServiceInstance from './../role/role.service';
import { User } from '../../database/models/user.model';

class UserController {

  async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const userData: CreateUserDto = req.body;
      
      if (!userData.name || !userData.email || !userData.password || !userData.role) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, password, and role are required'
        });
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      if (userData.password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }
      
      const role = await RoleServiceInstance.getRoleById(userData.role);
      if (!role) {
        return res.status(404).json({
          success: false,
          message: `Role with ID ${userData.role} not found`
        });
      }
      
      const newUser = await UserServiceInstance.createUser(userData);
      
      const userResponse = await UserServiceInstance.getUserById(newUser.id);
      
      return res.status(201).json({
        success: true,
        data: userResponse,
        message: 'User created successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to create user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      // Extract query parameters with type safety
      const query: UserQuery = {
        search: req.query.search as string | undefined,
        role: req.query.role as string | undefined,
        sortBy: req.query.sortBy as keyof User | undefined,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const users = await UserServiceInstance.getUsers(query);
      
      return res.status(200).json({
        success: true,
        ...users,
        message: users.data.length ? 'Users retrieved successfully' : 'No users found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async GetUsersForDropdown(req: Request, res: Response) : Promise<Response>{
    try {
      
      
      const users = await UserServiceInstance.getUsersDropdown();
      console.log('users: ', users);
      
      return res.status(200).json({
        success: true,
        ...users,
        message: users.data.length ? 'Users retrieved successfully' : 'No users found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const user = await UserServiceInstance.getUserById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUserByEmail(req: Request, res: Response): Promise<Response> {
    try {
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }
      
      const user = await UserServiceInstance.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with email ${email} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: user,
        message: 'User retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userData: UpdateUserDto = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      if (Object.keys(userData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No update data provided'
        });
      }
      
      if (userData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid email format'
          });
        }
      }
      
      if (userData.password && userData.password.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long'
        });
      }
      
      if (userData.role) {
        const role = await RoleServiceInstance.getRoleById(userData.role);
        if (!role) {
          return res.status(404).json({
            success: false,
            message: `Role with ID ${userData.role} not found`
          });
        }
      }
      
      const updatedUser = await UserServiceInstance.updateUser(id, userData);
      
      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedUser,
        message: 'User updated successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to update user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }
      
      const isDeleted = await UserServiceInstance.deleteUser(id);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getUsersByRole(req: Request, res: Response): Promise<Response> {
    try {
      const { roleId } = req.params;
      
      if (!roleId) {
        return res.status(400).json({
          success: false,
          message: 'Role ID is required'
        });
      }
      
      const role = await RoleServiceInstance.getRoleById(roleId);
      if (!role) {
        return res.status(404).json({
          success: false,
          message: `Role with ID ${roleId} not found`
        });
      }
      
      const users = await UserServiceInstance.getUsersByRole(roleId);
      
      return res.status(200).json({
        success: true,
        data: users,
        total: users.length,
        message: users.length ? 'Users retrieved successfully' : 'No users found for this role'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users by role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      const user = await UserServiceInstance.getUserWithPasswordByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      const isPasswordValid = await UserServiceInstance.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      const token = `dummy-token-${user.id}-${Date.now()}`;
      
      return res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          roleDetails: user.roleDetails,
          profile_image: user.profile_image,
          token
        },
        message: 'Login successful'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to authenticate user',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

const UserControllerInstance = new UserController();
export default UserControllerInstance;