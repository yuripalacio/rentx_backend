import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listAvailableCarsUseCase: ListAvailableCarsUseCase;
let carsReposityInMemory: CarsRepositoryInMemory;

describe("List Cras", () => {
  beforeEach(() => {
    carsReposityInMemory = new CarsRepositoryInMemory();
    listAvailableCarsUseCase = new ListAvailableCarsUseCase(
      carsReposityInMemory
    );
  });

  it("should be able to list all available cars", async () => {
    const car = await carsReposityInMemory.create({
      name: "Car test name",
      description: "Car test description",
      license_plate: "AAA9999",
      brand: "Car test",
      category_id: "5757bc59-bb66-49d3-ab38-5f4a89c58f44",
      daily_rate: 999,
      fine_amount: 999,
    });

    const cars = await listAvailableCarsUseCase.execute({});

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by name", async () => {
    const car = await carsReposityInMemory.create({
      name: "Car test name",
      description: "Car test description",
      license_plate: "AAA9999",
      brand: "Car test",
      category_id: "5757bc59-bb66-49d3-ab38-5f4a89c58f44",
      daily_rate: 999,
      fine_amount: 999,
    });

    const cars = await listAvailableCarsUseCase.execute({
      column: "name",
      searcher: "Car test name",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by brand", async () => {
    const car = await carsReposityInMemory.create({
      name: "Car test name",
      description: "Car test description",
      license_plate: "AAA9999",
      brand: "Car test",
      category_id: "5757bc59-bb66-49d3-ab38-5f4a89c58f44",
      daily_rate: 999,
      fine_amount: 999,
    });

    const cars = await listAvailableCarsUseCase.execute({
      column: "brand",
      searcher: "Car test",
    });

    expect(cars).toEqual([car]);
  });

  it("should be able to list all available cars by category", async () => {
    const car = await carsReposityInMemory.create({
      name: "Car test name",
      description: "Car test description",
      license_plate: "AAA9999",
      brand: "Car test",
      category_id: "5757bc59-bb66-49d3-ab38-5f4a89c58f44",
      daily_rate: 999,
      fine_amount: 999,
    });

    const cars = await listAvailableCarsUseCase.execute({
      column: "category_id",
      searcher: "5757bc59-bb66-49d3-ab38-5f4a89c58f44",
    });

    expect(cars).toEqual([car]);
  });
});
