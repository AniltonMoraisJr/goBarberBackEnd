import {  Request, Response, Router } from 'express';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();

appointmentsRouter.get('/', async (request: Request, response: Response) => {
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);
  const appointments = await appointmentsRepository.find();
  return response.status(200).json(appointments);
})

appointmentsRouter.post('/', async (request: Request, response: Response) => {
  const { provider, date } = request.body;
  try {
    const createAppointmentService = new CreateAppointmentService();
    const appointment = await createAppointmentService.execute({provider, date});
    return response.status(200).json(appointment);
  } catch (err) {
    return response.status(400).json({error: err.message});
  }
})

export default appointmentsRouter;