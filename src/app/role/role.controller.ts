import { Request, Response } from 'express';
import RoleServiceInstance, { CreateRoleDto, UpdateRoleDto, RoleQuery } from './role.service';
import { Role } from '../../database/models/role.model';

class RoleController {

  async createRole(req: Request, res: Response): Promise<Response> {
    try {
      const roleData: CreateRoleDto = req.body;
      
      if (!roleData.name) {
        return res.status(400).json({
          success: false,
          message: 'Role name is required'
        });
      }
      
      const newRole = await RoleServiceInstance.createRole(roleData);
      
      return res.status(201).json({
        success: true,
        data: newRole,
        message: 'Role created successfully'
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
        message: 'Failed to create role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRoles(req: Request, res: Response): Promise<Response> {
    try {
      const query: RoleQuery = {
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as keyof Role | undefined,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const roles = await RoleServiceInstance.getRoles(query);
      
      return res.status(200).json({
        success: true,
        ...roles,
        message: roles.data.length ? 'Roles retrieved successfully' : 'No roles found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve roles',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRoleById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Role ID is required'
        });
      }
      
      const role = await RoleServiceInstance.getRoleById(id);
      
      if (!role) {
        return res.status(404).json({
          success: false,
          message: `Role with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: role,
        message: 'Role retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateRole(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const roleData: UpdateRoleDto = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Role ID is required'
        });
      }
      
      // Check if there is any data to update
      if (Object.keys(roleData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No update data provided'
        });
      }
      
      const updatedRole = await RoleServiceInstance.updateRole(id, roleData);
      
      if (!updatedRole) {
        return res.status(404).json({
          success: false,
          message: `Role with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedRole,
        message: 'Role updated successfully'
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
        message: 'Failed to update role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteRole(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Role ID is required'
        });
      }
      
      const isDeleted = await RoleServiceInstance.deleteRole(id);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: `Role with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Role deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete role',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getRoleByName(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.params;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Role name is required'
        });
      }
      
      const role = await RoleServiceInstance.getRoleByName(name);
      
      if (!role) {
        return res.status(404).json({
          success: false,
          message: `Role with name "${name}" not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: role,
        message: 'Role retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve role by name',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

const RoleControllerInstance = new RoleController();
export default RoleControllerInstance;