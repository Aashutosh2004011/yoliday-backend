import express from 'express';
import CategoryControllerInstance from './../app/category/category.controller';

const categoryRouter = express.Router();

categoryRouter.get('/', CategoryControllerInstance.getCategories.bind(CategoryControllerInstance));
categoryRouter.get('/dropdown', CategoryControllerInstance.getCategoriesDropdown.bind(CategoryControllerInstance));
categoryRouter.get('/:id', CategoryControllerInstance.getCategoryById.bind(CategoryControllerInstance));
categoryRouter.get('/name/:name', CategoryControllerInstance.getCategoryByName.bind(CategoryControllerInstance));

categoryRouter.post('/', CategoryControllerInstance.createCategory.bind(CategoryControllerInstance));
categoryRouter.put('/:id',  CategoryControllerInstance.updateCategory.bind(CategoryControllerInstance));
categoryRouter.delete('/:id', CategoryControllerInstance.deleteCategory.bind(CategoryControllerInstance));

export default categoryRouter;
