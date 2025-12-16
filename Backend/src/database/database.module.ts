import { Global, Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';

//global
@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
