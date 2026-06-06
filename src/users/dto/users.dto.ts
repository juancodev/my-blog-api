import { IsString, IsNotEmpty, IsEmail, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger'; // (1)

import { CreateProfileDto, UpdateProfileDto } from './profile.dto';

// (2)
export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'The email of the user' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ description: 'The password of the user' })
  password!: string;

  // (3)
  @ValidateNested()
  // (4)
  @Type(() => CreateProfileDto)
  @IsNotEmpty()
  @ApiProperty({ description: 'The profile of the user' })
  profile!: CreateProfileDto;
}

// (5)
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['profile'])) {
  @ValidateNested()
  // (6)
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile!: UpdateProfileDto;
}

/**
  (1).- Cambiamos el paquete de mapper-types por "swagger" para resolver el problema de duplicar el DTO cada vez que lo creemos.
  (2).- El nombre debe ser la acción que realice. Por ejemplo, CreateUserDto para crear un usuario, UpdateUserDto para actualizar un usuario, etc. Esto es una buena práctica para mantener el código organizado y fácil de entender.
  (3).- Valida el objeto anidado, en este caso el profile. Es decir, que primero se cumpla los datos del dto de profile para luego validar el dto de user.
  (4).- Indica que el tipo de dato del profile es CreateProfileDto, esto es necesario para que class-validator pueda validar el objeto anidado.
  (5).- OmiteType es una función que nos permite crear un nuevo DTO a partir de otro DTO, en este caso, UpdateUserDto se crea a partir de CreateUserDto, pero omitiendo la propiedad profile, esto es necesario porque al actualizar un usuario, no es necesario enviar el perfil completo, sino solo aquellos campos que se desean actualizar.
  (6).- Indica que el tipo de dato del profile es CreateProfileDto, esto es necesario para que class-validator pueda validar el objeto anidado.
 */
