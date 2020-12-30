import {  Request, Response, Router } from 'express';
import AuthenticateUserService from '../services/AuthenticateUserService';


const sessionsRouter = Router();

/**
 * Create new session
 */
sessionsRouter.post('/', async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;
    
    const authenticateUserService = new AuthenticateUserService();

    const { user, token } = await authenticateUserService.execute({
      email,
      password
    });

    delete user.password;

    return response.status(200).json({user, token});
  } catch (err) {
    return response.status(500).json({error: err.message});
  }
})

export default sessionsRouter;