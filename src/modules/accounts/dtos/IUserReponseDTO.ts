interface IUserResponseDTO {
  email: string;
  username: string;
  id: string;
  avatar: string;
  driver_license: string;
  avatar_url(): string;
}

export { IUserResponseDTO };
