import {  Request, Response, Router } from 'express';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request: Request, response: Response) => {
  const appointments = appointmentsRepository.all();
  return response.status(200).json(appointments);
})

appointmentsRouter.post('/', (request: Request, response: Response) => {
  const { provider, date } = request.body;
  try {
    const createAppointmentService = new CreateAppointmentService(appointmentsRepository);
    const appointment = createAppointmentService.execute({provider, date});
    return response.status(200).json(appointment);
  } catch (err) {
    return response.status(400).json({error: err.message});
  }
})

export default appointmentsRouter;