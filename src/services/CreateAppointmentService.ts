import { parseISO, startOfHour } from "date-fns";
import Appointment from "../models/Appointment";
import AppointmentsRepository from "../repositories/AppointmentsRepository";

interface Request {
  provider: string;
  date: string;
}

class CreateAppointmentService {
  
  private appointmentsRepository: AppointmentsRepository;

  constructor(appointmentsRepository: AppointmentsRepository) {
    this.appointmentsRepository = appointmentsRepository;
  }

  public execute({provider, date} : Request): Appointment  {
    const parsedDate = parseISO(date);
    const appointmentDate = startOfHour(parsedDate);
    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(appointmentDate);
    if(findAppointmentInSameDate){
      throw Error('This appointment is already booked');
    }
    const appointment = this.appointmentsRepository.create({provider, date: appointmentDate});
    return appointment;
  }

}

export default CreateAppointmentService;