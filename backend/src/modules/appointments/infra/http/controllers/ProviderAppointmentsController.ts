import { Request, Response } from 'express';

import { container } from 'tsyringe';

import ListAppointmentsProviderService from '@modules/appointments/services/ListAppointmentsProviderService';
import { classToClass } from 'class-transformer';

export default class ProviderAppointmentController {
  public async index(request: Request, response: Response): Promise<Response> {
    const provider_id = request.user.id;
    const { month, year, day } = request.query;

    const listProviderAppointments = container.resolve(
      ListAppointmentsProviderService,
    );

    const appointments = await listProviderAppointments.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
      day: Number(day),
    });

    return response.json(classToClass(appointments));
  }
}
