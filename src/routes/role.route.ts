import { Router } from 'express';
import RoleControllerInstance from './../app/role/role.controller';

const RoleRouter = Router();

RoleRouter.post('/', RoleControllerInstance.createRole.bind(RoleControllerInstance));
RoleRouter.get('/', RoleControllerInstance.getRoles.bind(RoleControllerInstance));
RoleRouter.get('/:id', RoleControllerInstance.getRoleById.bind(RoleControllerInstance));
RoleRouter.put('/:id', RoleControllerInstance.updateRole.bind(RoleControllerInstance));
RoleRouter.delete('/:id', RoleControllerInstance.deleteRole.bind(RoleControllerInstance));
RoleRouter.get('/name/:name', RoleControllerInstance.getRoleByName.bind(RoleControllerInstance));

export default RoleRouter;