import * as Router from 'koa-router';
import { UserController } from '../controllers/user-controller';

export const userRoute = new Router();

userRoute.post('/', UserController.post);
