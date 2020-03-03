import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/login', SessionController.store);

routes.use(authMiddleware);
// The following routes will use authMiddleware

routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliveryman', DeliverymanController.index);

export default routes;
