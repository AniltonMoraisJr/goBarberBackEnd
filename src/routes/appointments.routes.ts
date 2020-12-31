import {  Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', ensureAuthenticated, async (request: Request, response: Response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return response.status(200).json(appointments);
})

appointmentsRouter.post('/', async (request: Request, response: Response) => {
  const { provider_id, date } = request.body;
  const createAppointmentService = new CreateAppointmentService();
  const appointment = await createAppointmentService.execute({provider_id, date});
  return response.status(200).json(appointment);
})

export default appointmentsRouter;