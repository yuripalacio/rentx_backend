import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider,
      carsRepositoryInMemory
    );
  });

  it("should be able to create a new rental", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test Car Name",
      description: "Car Test",
      daily_rate: 100,
      brand: "Test Brand",
      category_id: "1234",
      fine_amount: 40,
      license_plate: "AAA999",
    });

    const rental = await createRentalUseCase.execute({
      user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
      car_id: car.id,
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    await rentalsRepositoryInMemory.create({
      user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
      car_id: "firstCar",
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: "secondCar",
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("There's a rental in progress for user"));
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    const sameCar = await carsRepositoryInMemory.create({
      name: "Test Car Name",
      description: "Car Test",
      daily_rate: 100,
      brand: "Test Brand",
      category_id: "1234",
      fine_amount: 40,
      license_plate: "AAA999",
    });

    await createRentalUseCase.execute({
      user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
      car_id: sameCar.id,
      expected_return_date: dayAdd24Hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: sameCar.id,
        expected_return_date: dayAdd24Hours,
      })
    ).rejects.toEqual(new AppError("Car is unavailable"));
  });

  it("should not be able to create a new rental with invalid return time - less than 24h", async () => {
    const car = await carsRepositoryInMemory.create({
      name: "Test Car Name",
      description: "Car Test",
      daily_rate: 100,
      brand: "Test Brand",
      category_id: "1234",
      fine_amount: 40,
      license_plate: "AAA999",
    });

    await expect(
      createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: car.id,
        expected_return_date: dayjs().toDate(),
      })
    ).rejects.toEqual(new AppError("Invalid return time"));
  });
});
