import { Op } from 'sequelize';
import { Role } from './../../database/models/role.model';

export interface CreateRoleDto {
  name: string;
  description?: string;
}

export interface UpdateRoleDto {
  name?: string;
  description?: string;
}

export interface RoleQuery {
  search?: string;
  sortBy?: keyof Role;
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

class RoleService {

  async createRole(roleData: CreateRoleDto): Promise<Role> {
    try {
      const existingRole = await Role.findOne({ where: { name: roleData.name } });
      if (existingRole) {
        throw new Error(`Role with name "${roleData.name}" already exists`);
      }
      
      return await Role.create({
        name : roleData.name,
        description : roleData.description
      });
    } catch (error) {
      throw error;
    }
  }

  async getRoles(query: RoleQuery): Promise<PaginatedResponse<Role>> {
    try {
      const { search, sortBy = 'createdAt', sortOrder = 'DESC', limit = 10, offset = 0 } = query;
      
      const whereClause: any = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const total = await Role.count({ where: whereClause });
      
      const roles = await Role.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: [{ all: true }]
      });
      
      return {
        data: roles,
        total,
        limit,
        offset
      };
    } catch (error) {
      throw error;
    }
  }

  async getRoleById(id: string): Promise<Role | null> {
    try {
      const role = await Role.findByPk(id, {
        include: [{ all: true }]
      });
      
      if (!role) {
        return null;
      }
      
      return role;
    } catch (error) {
      throw error;
    }
  }

  async updateRole(id: string, roleData: UpdateRoleDto): Promise<Role | null> {
    try {
      const role = await Role.findByPk(id);
      
      if (!role) {
        return null;
      }
      
      if (roleData.name && roleData.name !== role.name) {
        const existingRole = await Role.findOne({ where: { name: roleData.name } });
        if (existingRole) {
          throw new Error(`Role with name "${roleData.name}" already exists`);
        }
      }
      
      await role.update(roleData);
      return role;
    } catch (error) {
      throw error;
    }
  }

  async deleteRole(id: string): Promise<boolean> {
    try {
      const role = await Role.findByPk(id);
      
      if (!role) {
        return false;
      }
      
      await role.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }


  async getRoleByName(name: string): Promise<Role | null> {
    try {
      return await Role.findOne({
        where: { name },
        include: [{ all: true }]
      });
    } catch (error) {
      throw error;
    }
  }
}

const RoleServiceInstance = new RoleService();
export default RoleServiceInstance;