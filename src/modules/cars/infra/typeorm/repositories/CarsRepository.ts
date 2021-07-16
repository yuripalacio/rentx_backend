import { getRepository, Repository } from "typeorm";

import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Car } from "../entities/Car";

class CarsRepository implements ICarsRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async create({
    id,
    name,
    description,
    license_plate,
    brand,
    category_id,
    daily_rate,
    fine_amount,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = this.repository.create({
      id,
      name,
      description,
      license_plate,
      brand,
      category_id,
      daily_rate,
      fine_amount,
    });

    await this.repository.save(car);

    return car;
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = await this.repository.findOne({
      license_plate,
    });

    return car;
  }

  async findAvailable(
    column?: "name" | "brand" | "category_id",
    searcher?: string
  ): Promise<Car[]> {
    const carsQuery = await this.repository
      .createQueryBuilder("c")
      .where("c.available = :available", { available: true });

    if (column && searcher) {
      carsQuery.andWhere(`c.${column} = :value`, { value: searcher });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async findById(id: string): Promise<Car> {
    const car = await this.repository.findOne(id);

    return car;
  }
}

export { CarsRepository };
