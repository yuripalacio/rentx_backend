import { inject, injectable } from "tsyringe";
import { hash } from "bcryptjs";

import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    username,
    password,
    email,
    driver_license,
  }: ICreateUserDTO): Promise<void> {
    const userEmailAlreadyExists = await this.usersRepository.findByEmail(
      email
    );
    const userUsernameAlreadyExists = await this.usersRepository.findByUsername(
      username
    );

    if (userEmailAlreadyExists || userUsernameAlreadyExists) {
      throw new AppError("User email/username already exists");
    }

    const passwordHash = await hash(password, 8);

    await this.usersRepository.create({
      name,
      username,
      password: passwordHash,
      email,
      driver_license,
    });
  }
}

export { CreateUserUseCase };
