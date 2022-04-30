import { IsString } from 'class-validator';
import { LoginRequest, RegisterRequest, ValidateRequest } from '../auth.pb';
import { IsEmailCustom } from './../../commons/decorators/validation/isEmail.decorator';
import { IsRequiredString } from './../../commons/decorators/validation/isRequiredString.decorator';

export class LoginRequestDto implements LoginRequest {
  @IsEmailCustom({ required: true })
  public readonly email: string;

  @IsRequiredString()
  public readonly password: string;
}

export class RegisterRequestDto implements RegisterRequest {
  @IsEmailCustom({ required: true })
  public readonly email: string;

  @IsRequiredString({ minLength: 8 })
  public readonly password: string;
}

export class ValidateRequestDto implements ValidateRequest {
  @IsString()
  public readonly token: string;
}
