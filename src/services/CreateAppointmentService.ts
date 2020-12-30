import { parseISO, startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import Appointment from "../models/Appointment";
import User from "../models/User";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface Request {
  provider_id: string;
  date: string;
}

class CreateAppointmentService {

  public async execute({provider_id, date} : Request): Promise<Appointment>  {
    
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const parsedDate = parseISO(date);
    const appointmentDate = startOfHour(parsedDate);

    try {

      const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);
      
      if(findAppointmentInSameDate){
        throw Error('This appointment is already booked');
      }

      const appointment = appointmentsRepository.create({provider_id, date: appointmentDate});
  
      await appointmentsRepository.save(appointment);
      
      return appointment;

    } catch (error) {
      throw Error(`Error on save appointment: ${error.message}`);
    }

  }

}

export default CreateAppointmentService;