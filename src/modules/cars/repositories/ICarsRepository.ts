import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "../infra/typeorm/entities/Car";

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(
    column?: "name" | "brand" | "category_id",
    searcher?: string
  ): Promise<Car[]>;
  findById(id: string): Promise<Car>;
}

export { ICarsRepository };
