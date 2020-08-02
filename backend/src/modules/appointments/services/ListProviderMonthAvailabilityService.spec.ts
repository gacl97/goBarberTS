import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentService';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailabilityService;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailibility', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('Should be able to list the month availibility from provider', async () => {
    const nextYear = new Date().getFullYear() + 1;
    const hoursAvailablesInDay = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

    hoursAvailablesInDay.forEach(async hour =>
      fakeAppointmentsRepository.create({
        provider_id: 'provider_id',
        user_id: 'user_id',
        date: new Date(nextYear, 4, 20, hour, 0, 0),
      }),
    );

    await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(nextYear, 4, 21, 8, 0, 0),
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider_id',
      month: 5,
      year: nextYear,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
