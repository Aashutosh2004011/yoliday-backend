import { Router } from 'express';
import UserControllerInstance from './../app/user/user.controller';

const userRouter = Router();

userRouter.post('/', UserControllerInstance.createUser.bind(UserControllerInstance));
userRouter.get('/', UserControllerInstance.getUsers.bind(UserControllerInstance));
userRouter.get('/dropdown', UserControllerInstance.GetUsersForDropdown.bind(UserControllerInstance));
userRouter.get('/:id', UserControllerInstance.getUserById.bind(UserControllerInstance));
userRouter.put('/:id', UserControllerInstance.updateUser.bind(UserControllerInstance));
userRouter.delete('/:id', UserControllerInstance.deleteUser.bind(UserControllerInstance));
userRouter.get('/email/:email', UserControllerInstance.getUserByEmail.bind(UserControllerInstance));
userRouter.get('/role/:roleId', UserControllerInstance.getUsersByRole.bind(UserControllerInstance));
userRouter.post('/login', UserControllerInstance.login.bind(UserControllerInstance));

export default userRouter;
