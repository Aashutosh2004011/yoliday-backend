import { Request, Response } from 'express';
import CategoryServiceInstance, { CreateCategoryDto, UpdateCategoryDto, CategoryQuery } from './category.service';
import { Category } from '../../database/models/category.model';

class CategoryController {

  async createCategory(req: Request, res: Response): Promise<Response> {
    try {
      const categoryData: CreateCategoryDto = req.body;
      
      if (!categoryData.name) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }
      
      const newCategory = await CategoryServiceInstance.createCategory(categoryData);
      
      return res.status(201).json({
        success: true,
        data: newCategory,
        message: 'Category created successfully'
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
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCategories(req: Request, res: Response): Promise<Response> {
    try {
      const query: CategoryQuery = {
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as keyof Category | undefined,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const categories = await CategoryServiceInstance.getCategories(query);
      
      return res.status(200).json({
        success: true,
        ...categories,
        message: categories.data.length ? 'Categories retrieved successfully' : 'No categories found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCategoriesDropdown(req: Request, res: Response): Promise<Response> {
    try {
      
      const categories = await CategoryServiceInstance.getCategoriesDropdown();
      
      return res.status(200).json({
        success: true,
        ...categories,
        message: categories.data.length ? 'Categories retrieved successfully' : 'No categories found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }
      
      const category = await CategoryServiceInstance.getCategoryById(id);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Category with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: category,
        message: 'Category retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const categoryData: UpdateCategoryDto = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }
      
      // Check if there is any data to update
      if (Object.keys(categoryData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No update data provided'
        });
      }
      
      const updatedCategory = await CategoryServiceInstance.updateCategory(id, categoryData);
      
      if (!updatedCategory) {
        return res.status(404).json({
          success: false,
          message: `Category with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedCategory,
        message: 'Category updated successfully'
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
        message: 'Failed to update category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }
      
      const isDeleted = await CategoryServiceInstance.deleteCategory(id);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: `Category with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('associated projects')) {
        return res.status(409).json({
          success: false,
          message: error.message
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'Failed to delete category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getCategoryByName(req: Request, res: Response): Promise<Response> {
    try {
      const { name } = req.params;
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }
      
      const category = await CategoryServiceInstance.getCategoryByName(name);
      
      if (!category) {
        return res.status(404).json({
          success: false,
          message: `Category with name "${name}" not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: category,
        message: 'Category retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve category by name',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

const CategoryControllerInstance = new CategoryController();
export default CategoryControllerInstance;