import { AppError } from "@shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "../../in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "000000",
      email: "johndoe@test.com",
      username: "johndoe",
      password: "test_password",
      name: "John Doe",
    };

    await createUserUseCase.execute(user);

    const authenticate = await authenticateUserUseCase.execute({
      username: user.username,
      password: user.password,
    });

    expect(authenticate).toHaveProperty("token");
  });

  it("should not be able to authenticate with nonexistent user", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        username: "NonexistentUser",
        password: "0000",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong password", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        driver_license: "000000",
        email: "johndoe@test.com",
        username: "johndoe",
        password: "test_password",
        name: "John Doe",
      };

      await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        username: "johndoe",
        password: "WrongPassowrd",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
