import {  Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import User from '../models/User';
import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

/**
 * Get list of users
 */

usersRouter.get('/', async (request: Request, response: Response) => {
  const usersRepository = getRepository(User);
  const listOfUsers = await usersRepository.find();
  return response.status(200).json(listOfUsers);
})

/**
 * Create new user
 */
usersRouter.post('/', async (request: Request, response: Response) => {
  const {name, email, password: pass} = request.body;
  const createUserService = new CreateUserService();

  const user = await createUserService.execute({
    name, 
    email,
    password: pass
  });

  const {password, ...userWithoutPassword} = user;

  return response.status(200).json(userWithoutPassword);
})

/**
 * Update avatar
 */
usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (request: Request, response: Response) => {
  const updateUserAvatarService = new UpdateUserAvatarService();
  const user = await updateUserAvatarService.execute({
    user_id: request.user.id,
    avatarFileName: request.file.filename
  });
  delete user.password;
  return response.status(200).json({user})
});



export default usersRouter;