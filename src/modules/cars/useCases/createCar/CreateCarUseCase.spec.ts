import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/AppError";
import { CreateCarUseCase } from "./CreateCarUseCase";

let createCarUseCase: CreateCarUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;

describe("Create Car", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("should be able to create a new car", async () => {
    const car = await createCarUseCase.execute({
      name: "Cars name",
      description: "Cars description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Cars brand",
      category_id: "category_id",
    });

    expect(car).toHaveProperty("id");
  });

  it("should not be able to create a car with exists license plate", async () => {
    await createCarUseCase.execute({
      name: "Cars name",
      description: "Cars description",
      daily_rate: 100,
      license_plate: "Sale license plate",
      fine_amount: 60,
      brand: "Cars brand",
      category_id: "category_id",
    });

    await expect(
      createCarUseCase.execute({
        name: "Cars name",
        description: "Cars description",
        daily_rate: 100,
        license_plate: "Sale license plate",
        fine_amount: 60,
        brand: "Cars brand",
        category_id: "category_id",
      })
    ).rejects.toEqual(new AppError("Car already exists"));
  });

  it("should be able to create a new car with available true by default", async () => {
    const car = await createCarUseCase.execute({
      name: "Cars name",
      description: "Cars description",
      daily_rate: 100,
      license_plate: "ABC-1234",
      fine_amount: 60,
      brand: "Cars brand",
      category_id: "category_id",
    });

    expect(car.available).toBe(true);
  });
});
