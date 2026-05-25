import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

// El nombre debe ser la acción que realice.
export class CreateProfileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsUrl()
  @IsOptional()
  avatar: string;
}

// mapped-type es una función que nos permite crear un nuevo DTO a partir de otro DTO, en este caso, UpdateProfileDto se crea a partir de CreateProfileDto, pero con todas las propiedades opcionales, lo que significa que al actualizar un perfil, no es necesario enviar todos los campos, sino solo aquellos que se desean actualizar.
export class UpdateProfileDto extends PartialType(CreateProfileDto) {}
