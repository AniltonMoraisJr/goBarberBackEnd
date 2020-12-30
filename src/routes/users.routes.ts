import {  Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

/**
 * Get list of users
 */

usersRouter.get('/', async (request: Request, response: Response) => {
  try {
    const usersRepository = getRepository(User);
    const listOfUsers = await usersRepository.find();
    return response.status(200).json(listOfUsers);
  } catch (err) {
    return response.status(500).json({error: err.message});
  }
})

/**
 * Create new user
 */
usersRouter.post('/', async (request: Request, response: Response) => {
  try {
    const {name, email, password: pass} = request.body;
    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name, 
      email,
      password: pass
    });

    const {password, ...userWithoutPassword} = user;

    return response.status(200).json(userWithoutPassword);
  } catch (err) {
    return response.status(500).json({error: err.message});
  }
})

export default usersRouter;