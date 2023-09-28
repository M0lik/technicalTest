import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    ScheduleModule.forRoot(),
    CryptoModule,
    TasksModule,
  ],
})
export class AppModule {}
