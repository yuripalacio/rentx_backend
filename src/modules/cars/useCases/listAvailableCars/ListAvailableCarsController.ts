import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { column, searcher } = request.query;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase
    );

    const cars = await listAvailableCarsUseCase.execute({
      column: column as "name" | "brand" | "category_id",
      searcher: searcher as string,
    });

    return response.json(cars);
  }
}

export { ListAvailableCarsController };
