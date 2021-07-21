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

  it("should not be able to authenticate with nonexistent user", async () => {
    await expect(
      authenticateUserUseCase.execute({
        username: "NonexistentUser",
        password: "0000",
      })
    ).rejects.toEqual(new AppError("User or password incorrect"));
  });

  it("should not be able to authenticate with wrong password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "000000",
      email: "johndoe@test.com",
      username: "johndoe",
      password: "test_password",
      name: "John Doe",
    };

    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        username: "johndoe",
        password: "WrongPassowrd",
      })
    ).rejects.toEqual(new AppError("User or password incorrect"));
  });
});
