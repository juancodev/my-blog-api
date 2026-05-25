import { IsString, IsNotEmpty, IsEmail, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { PartialType, OmitType } from '@nestjs/mapped-types';

// El nombre debe ser la acción que realice.
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

// OmiteType es una función que nos permite crear un nuevo DTO a partir de otro DTO, en este caso, UpdateUserDto se crea a partir de CreateUserDto, pero omitiendo la propiedad profile, esto es necesario porque al actualizar un usuario, no es necesario enviar el perfil completo, sino solo aquellos campos que se desean actualizar.
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['profile'])) {
  @ValidateNested()
  // Indica que el tipo de dato del profile es CreateProfileDto, esto es necesario para que class-validator pueda validar el objeto anidado.
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile: UpdateProfileDto;
}
