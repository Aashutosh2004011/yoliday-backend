import express from 'express';
import ProjectControllerInstance from './../app/project/project.controller';

const projectRouter = express.Router();

projectRouter.get('/', ProjectControllerInstance.getProjects.bind(ProjectControllerInstance));
projectRouter.get('/:id', ProjectControllerInstance.getProjectById.bind(ProjectControllerInstance));
projectRouter.get('/category/:categoryId', ProjectControllerInstance.getProjectsByCategory.bind(ProjectControllerInstance));
projectRouter.get('/author/:authorId', ProjectControllerInstance.getProjectsByAuthor.bind(ProjectControllerInstance));

projectRouter.post('/', ProjectControllerInstance.createProject.bind(ProjectControllerInstance));
projectRouter.put('/:id', ProjectControllerInstance.updateProject.bind(ProjectControllerInstance));
projectRouter.delete('/:id', ProjectControllerInstance.deleteProject.bind(ProjectControllerInstance));

export default projectRouter;
