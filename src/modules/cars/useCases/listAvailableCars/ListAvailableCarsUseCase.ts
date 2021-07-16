import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { inject, injectable } from "tsyringe";

interface IRequest {
  column?: "name" | "brand" | "category_id";
  searcher?: string;
}

@injectable()
class ListAvailableCarsUseCase {
  constructor(
    @inject("CarsRepository")
    private carsReposity: ICarsRepository
  ) {}

  async execute({ column, searcher }: IRequest): Promise<Car[]> {
    const cars = await this.carsReposity.findAvailable(column, searcher);

    return cars;
  }
}

export { ListAvailableCarsUseCase };
