import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsOptional, MinLength, ValidateNested } from 'class-validator';

// El nombre debe ser la acción que realice.

export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  avatar: string;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  // Valida el objeto anidado, en este caso el profile. Es decir, que primero se compla los datos del dto de profile para luego validar el dto de user.
  @ValidateNested()
  // Indica que el tipo de dato del profile es CreateProfileDto, esto es necesario para que class-validator pueda validar el objeto anidado.
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  profile: CreateProfileDto;
}

export class UpdateUserDto {
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password: string;
}
