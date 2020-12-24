import { parseISO, startOfHour } from "date-fns";
import { getCustomRepository } from "typeorm";
import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface Request {
  provider: string;
  date: string;
}

class CreateAppointmentService {

  public async execute({provider, date} : Request): Promise<Appointment>  {
    
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);

    const parsedDate = parseISO(date);
    const appointmentDate = startOfHour(parsedDate);

    try {

      const findAppointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);
      
      if(findAppointmentInSameDate){
        throw Error('This appointment is already booked');
      }
      
      const appointment = appointmentsRepository.create({provider, date: appointmentDate});
  
      await appointmentsRepository.save(appointment);
      
      return appointment;

    } catch (error) {
      throw Error(`Error on save appointment: ${error.message}`);
    }

  }

}

export default CreateAppointmentService;