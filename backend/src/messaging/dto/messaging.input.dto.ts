export interface OtpDto {
  secret: string;
  token: string;
}

export interface MessageDto {
  name: string;
  token: string;
  contact: string;
  template: Template;
}

export enum Template {
  EMAIL_VERIFICATION,
  BVN_VERIFICATION,
  PASSWORD_RESET,
}
