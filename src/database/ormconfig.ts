import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['./src/**/*.entity.{ts,js}'],
  migrations: ['./src/database/migrations/*.{ts,js}'],
  synchronize: false,
});

// entities: hace referencia a las entidades que se van a utilizar en la aplicación, es decir, las clases que representan las tablas de la base de datos. En este caso, se están buscando archivos con extensión .ts o .js dentro de la carpeta src que tengan el formato *.entity.{ts,js}.

// migrations: hace referencia a las migraciones que se van a utilizar en la aplicación, es decir, los archivos que contienen las instrucciones para modificar la estructura de la base de datos. En este caso, se están buscando archivos con extensión .ts o .js dentro de la carpeta src/database/migrations que tengan el formato *.{ts,js}.
