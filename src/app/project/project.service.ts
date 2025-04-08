import { Op } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import { Project } from '../../database/models/project.model';
import { ProjectImage } from '../../database/models/projectImage.model';
import { Category } from '../../database/models/category.model';
import { User } from '../../database/models/user.model';

export interface ProjectImageDto {
  base64Image: string;
  caption?: string;
  fileName: string;
}

export interface CreateProjectDto {
  title: string;
  description?: string;
  category: string;
  author: string;
  image_url?: string;
  projectImages?: ProjectImageDto[];
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  category?: string;
  image_url?: string;
  projectImages?: ProjectImageDto[];
}

export interface ProjectQuery {
  search?: string;
  categoryId?: string;
  authorId?: string;
  sortBy?: keyof Project;
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

class ProjectService {
  private createDirectoryIfNotExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  private saveBase64Image(base64Image: string, fileName: string, projectId: string): string {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    
    const uploadDir = path.join('upload', 'project', projectId);
    this.createDirectoryIfNotExists(uploadDir);
    
    const timestamp = new Date().getTime();
    const fileExtension = path.extname(fileName) || '.jpg';
    const uniqueFileName = `${path.basename(fileName, fileExtension)}_${timestamp}${fileExtension}`;
    const filePath = path.join(uploadDir, uniqueFileName);
    
    fs.writeFileSync(filePath, base64Data, 'base64');
    
    return path.join('project', projectId, uniqueFileName);
  }

  async createProject(projectData: CreateProjectDto): Promise<Project> {
    try {
      const newProject = await Project.create({
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        author: projectData.author,
        image_url: projectData.image_url
      });
      
      if (projectData.projectImages && projectData.projectImages.length > 0) {
        await this.processProjectImages(newProject.id, projectData.projectImages);
      }
      
      return this.getProjectById(newProject.id) as Promise<Project>;
    } catch (error) {
      throw error;
    }
  }

  private async processProjectImages(projectId: string, images: ProjectImageDto[]): Promise<void> {
    for (const imageData of images) {
      const imagePath = this.saveBase64Image(imageData.base64Image, imageData.fileName, projectId);
      
      await ProjectImage.create({
        projectId: projectId,
        image_url: imagePath,
        caption: imageData.caption
      });
    }
  }

  async getProjects(query: ProjectQuery): Promise<PaginatedResponse<Project>> {
    try {
      const { 
        search, 
        categoryId, 
        authorId, 
        sortBy = 'createdAt', 
        sortOrder = 'DESC', 
        limit = 10, 
        offset = 0 
      } = query;
      
      const whereClause: any = {};
      
      
      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (categoryId) {
        whereClause.category = categoryId;
      }
      
      if (authorId) {
        whereClause.author = authorId;
      }
      
      const total = await Project.count({ where: whereClause });
      
      const projects = await Project.findAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        include: [
          { model: Category, as: 'categoryDetails' },
          { model: User, as: 'userDetails' },
          { model: ProjectImage }
        ]
      });
      
      return {
        data: projects,
        total,
        limit,
        offset
      };
    } catch (error) {
      throw error;
    }
  }

  async getProjectById(id: string): Promise<Project | null> {
    try {
      const project = await Project.findByPk(id, {
        include: [
          { model: Category, as: 'categoryDetails' },
          { model: User, as: 'userDetails' },
          { model: ProjectImage }
        ]
      });
      
      if (!project) {
        return null;
      }
      
      return project;
    } catch (error) {
      throw error;
    }
  }

  async updateProject(id: string, projectData: UpdateProjectDto): Promise<Project | null> {
    try {
      const project = await Project.findByPk(id);
      
      if (!project) {
        return null;
      }
      
      await project.update({
        title: projectData.title,
        description: projectData.description,
        category: projectData.category,
        image_url: projectData.image_url
      });
      
      if (projectData.projectImages && projectData.projectImages.length > 0) {
        await this.processProjectImages(id, projectData.projectImages);
      }
      
      return this.getProjectById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const project = await Project.findByPk(id);
      
      if (!project) {
        return false;
      }
      
      const projectImages = await ProjectImage.findAll({ where: { projectId: id } });
      
      for (const image of projectImages) {
        const imagePath = path.join('upload', image.image_url);
        
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      const projectDir = path.join('upload', 'project', id);
      if (fs.existsSync(projectDir)) {
        fs.rmdirSync(projectDir, { recursive: true });
      }
      
      await project.destroy();
      return true;
    } catch (error) {
      throw error;
    }
  }

  async getProjectsByCategory(categoryId: string): Promise<Project[]> {
    try {
      return await Project.findAll({
        where: { category: categoryId },
        include: [
          { model: Category, as: 'categoryDetails' },
          { model: User, as: 'userDetails' },
          { model: ProjectImage }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  async getProjectsByAuthor(authorId: string): Promise<Project[]> {
    try {
      return await Project.findAll({
        where: { author: authorId },
        include: [
          { model: Category, as: 'categoryDetails' },
          { model: User, as: 'userDetails' },
          { model: ProjectImage }
        ]
      });
    } catch (error) {
      throw error;
    }
  }
}

const ProjectServiceInstance = new ProjectService();
export default ProjectServiceInstance;