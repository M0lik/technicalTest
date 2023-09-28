import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { TasksService } from './service/tasks.service';
import { CryptoIndex, CryptoIndexSchema } from 'src/crypto/schema/index.schema';
import { Price, PriceSchema } from 'src/crypto/schema/price.schema';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CryptoIndex.name, schema: CryptoIndexSchema },
      { name: Price.name, schema: PriceSchema },
    ]),
    HttpModule,
    CryptoModule
  ],
  providers: [TasksService],
})
export class TasksModule {}
