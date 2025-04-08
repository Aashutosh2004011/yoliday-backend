import { Op } from 'sequelize';
import { Category } from '../../database/models/category.model';
import { Project } from '../../database/models/project.model';

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}

export interface CategoryQuery {
  search?: string;
  sortBy?: keyof Category;
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

class CategoryService {

  async createCategory(categoryData: CreateCategoryDto): Promise<Category> {
    try {
      const existingCategory = await Category.findOne({ where: { name: categoryData.name } });
      if (existingCategory) {
        throw new Error(`Category with name "${categoryData.name}" already exists`);
      }
      
      return await Category.create({
        name: categoryData.name,
        description: categoryData.description
      });
    } catch (error) {
      throw error;
    }
  }

  async getCategories(query: CategoryQuery): Promise<PaginatedResponse<Category>> {
    try {
      const { search, sortBy = 'createdAt', sortOrder = 'DESC', limit = 10, offset = 0 } = query;
      
      const whereClause: any = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      const total = await Category.count({ where: whereClause });
      
      const categories = await Category.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset
      });
      
      return {
        data: categories,
        total,
        limit,
        offset
      };
    } catch (error) {
      throw error;
    }
  }

  async getCategoriesDropdown(): Promise<PaginatedResponseDropdown<Category>> {
    try {
      

      
      const total = await Category.count();
      
      const categories = await Category.findAll({
      });
      
      return {
        data: categories,
        total
      };
    } catch (error) {
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await Category.findByPk(id, {
        include: [{ model: Project }]
      });
      
      if (!category) {
        return null;
      }
      
      return category;
    } catch (error) {
      throw error;
    }
  }

  async updateCategory(id: string, categoryData: UpdateCategoryDto): Promise<Category | null> {
    try {
      const category = await Category.findByPk(id);
      
      if (!category) {
        return null;
      }
      
      if (categoryData.name && categoryData.name !== category.name) {
        const existingCategory = await Category.findOne({ where: { name: categoryData.name } });
        if (existingCategory) {
          throw new Error(`Category with name "${categoryData.name}" already exists`);
        }
      }
      
      await category.update(categoryData);
      return category;
    } catch (error) {
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const category = await Category.findByPk(id);
      
      if (!category) {
        return false;
      }
      
      // Check if category has associated projects
      const projectCount = await Project.count({ where: { category: id } });
      if (projectCount > 0) {
        throw new Error(`Cannot delete category with ${projectCount} associated projects`);
      }
      
      await category.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    try {
      return await Category.findOne({
        where: { name },
        include: [{ model: Project }]
      });
    } catch (error) {
      throw error;
    }
  }
}

const CategoryServiceInstance = new CategoryService();
export default CategoryServiceInstance;