import { Request, Response } from 'express';
import ProjectServiceInstance, { CreateProjectDto, UpdateProjectDto, ProjectQuery } from './project.service';
import { Project } from '../../database/models/project.model';

class ProjectController {
  async createProject(req: Request, res: Response): Promise<Response> {
    try {
      const projectData: CreateProjectDto = req.body;
      
      if (!projectData.title) {
        return res.status(400).json({
          success: false,
          message: 'Project title is required'
        });
      }
      
      if (!projectData.category) {
        return res.status(400).json({
          success: false,
          message: 'Category is required'
        });
      }
      
      if (!projectData.author) {
        return res.status(400).json({
          success: false,
          message: 'Author is required'
        });
      }
      
      const newProject = await ProjectServiceInstance.createProject(projectData);
      console.log('newProject: ', newProject);
      
      return res.status(201).json({
        success: true,
        data: newProject,
        message: 'Project created successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } 
  }

  async getProjects(req: Request, res: Response): Promise<Response> {
    try {
      const query: ProjectQuery = {
        search: req.query.search as string | undefined,
        categoryId: req.query.categoryId as string | undefined,
        authorId: req.query.authorId as string | undefined,
        sortBy: req.query.sortBy as keyof Project | undefined,
        sortOrder: req.query.sortOrder as 'ASC' | 'DESC' | undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };
      
      const projects = await ProjectServiceInstance.getProjects(query);
      
      return res.status(200).json({
        success: true,
        ...projects,
        message: projects.data.length ? 'Projects retrieved successfully' : 'No projects found'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getProjectById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }
      
      const project = await ProjectServiceInstance.getProjectById(id);
      
      if (!project) {
        return res.status(404).json({
          success: false,
          message: `Project with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: project,
        message: 'Project retrieved successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateProject(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const projectData: UpdateProjectDto = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }
      
      // Check if there is any data to update
      if (Object.keys(projectData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No update data provided'
        });
      }
      
      const updatedProject = await ProjectServiceInstance.updateProject(id, projectData);
      
      if (!updatedProject) {
        return res.status(404).json({
          success: false,
          message: `Project with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        data: updatedProject,
        message: 'Project updated successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteProject(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Project ID is required'
        });
      }
      
      const isDeleted = await ProjectServiceInstance.deleteProject(id);
      
      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: `Project with ID ${id} not found`
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Project deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getProjectsByCategory(req: Request, res: Response): Promise<Response> {
    try {
      const { categoryId } = req.params;
      
      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }
      
      const projects = await ProjectServiceInstance.getProjectsByCategory(categoryId);
      
      return res.status(200).json({
        success: true,
        data: projects,
        message: projects.length ? 'Projects retrieved successfully' : 'No projects found for this category'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects by category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getProjectsByAuthor(req: Request, res: Response): Promise<Response> {
    try {
      const { authorId } = req.params;
      
      if (!authorId) {
        return res.status(400).json({
          success: false,
          message: 'Author ID is required'
        });
      }
      
      const projects = await ProjectServiceInstance.getProjectsByAuthor(authorId);
      
      return res.status(200).json({
        success: true,
        data: projects,
        message: projects.length ? 'Projects retrieved successfully' : 'No projects found for this author'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve projects by author',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

const ProjectControllerInstance = new ProjectController();
export default ProjectControllerInstance;