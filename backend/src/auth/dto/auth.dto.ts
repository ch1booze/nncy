export class SignupDto {
  phoneNumber: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

export class LoginDto {
  username: string;
  password: string;
}
