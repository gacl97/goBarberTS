import AppError from '@shared/errors/AppError';

import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentService';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentRepository,
      fakeNotificationsRepository,
      fakeCacheProvider,
    );
  });

  it('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user',
      provider_id: '1232',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1232');
  });

  it('Should not be able to create tow appointments on the same time', async () => {
    const nextYear = new Date().getFullYear() + 1;

    const appointmentDate = new Date(nextYear, 4, 10, 13);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user',
      provider_id: '12321',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user',
        provider_id: '12321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: '1232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment with same user as provider', async () => {
    const nextYear = new Date().getFullYear() + 1;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(nextYear, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(nextYear, 4, 10, 13),
        user_id: 'user-id',
        provider_id: 'user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment before 8am and after 5pm', async () => {
    const nextYear = new Date().getFullYear() + 1;

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(nextYear, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(nextYear, 4, 11, 7),
        user_id: 'user-id',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(nextYear, 4, 11, 18),
        user_id: 'user-id',
        provider_id: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
