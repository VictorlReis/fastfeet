import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import RecipientController from './app/controllers/RecipientController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);
routes.post('/recipients', RecipientController.store);

routes.use(authMiddleware);
// The following routes will use authMiddleware
routes.put('/users', UserController.update);
routes.put('recipients', RecipientController.update);

export default routes;
