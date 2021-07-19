import dayjs from "dayjs";

import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepositoryInMemory,
      dayjsDateProvider
    );
  });

  it("should be able to create a new rental", async () => {
    const rental = await createRentalUseCase.execute({
      user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
      car_id: "1758ab65-9af0-4786-af28-fecf4404b1aa",
      expected_return_date: dayAdd24Hours,
    });

    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("should not be able to create a new rental if there is another open to the same user", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: "1758ab65-9af0-4786-af28-fecf4404b1aa",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: "another-car-4786-af28-fecf4404b1aa",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental if there is another open to the same car", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: "sameCar-9af0-4786-af28-fecf4404b1aa",
        expected_return_date: dayAdd24Hours,
      });

      await createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: "sameCar-9af0-4786-af28-fecf4404b1aa",
        expected_return_date: dayAdd24Hours,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create a new rental with invalid return time - less than 24h", async () => {
    expect(async () => {
      await createRentalUseCase.execute({
        user_id: "c733aa0c-aaf5-4b8e-9569-d60d65eb7fb5",
        car_id: "1758ab65-9af0-4786-af28-fecf4404b1aa",
        expected_return_date: dayjs().toDate(),
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
