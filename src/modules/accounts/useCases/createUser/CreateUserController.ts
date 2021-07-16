import { Request, response, Response } from "express";
import { container } from "tsyringe";
import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, respose: Response): Promise<Response> {
    const { name, username, password, email, driver_license } = request.body;
    const createUserUseCase = container.resolve(CreateUserUseCase);

    await createUserUseCase.execute({
      name,
      username,
      password,
      email,
      driver_license,
    });

    return respose.status(201).send();
  }
}

export { CreateUserController };
