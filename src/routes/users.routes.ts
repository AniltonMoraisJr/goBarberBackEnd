import {  Request, Response, Router } from 'express';
import { getRepository } from 'typeorm';
import User from '../models/User';
import CreateUserService from '../services/CreateUserService';

const appointmentsRouter = Router();

/**
 * Get list of users
 */

appointmentsRouter.get('/', async (request: Request, response: Response) => {
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
appointmentsRouter.post('/', async (request: Request, response: Response) => {
  try {
    const {name, email, password} = request.body;
    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name, 
      email,
      password
    });

    delete user.password;

    return response.status(200).json(user);
  } catch (err) {
    return response.status(500).json({error: err.message});
  }
})

export default appointmentsRouter;