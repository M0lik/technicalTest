import { Module } from '@nestjs/common';
import { CryptoGateway } from './gateway/crypto.gateway';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { CryptoIndex, CryptoIndexSchema } from './schema/index.schema';
import { Price, PriceSchema } from './schema/price.schema';
import { CryptoService } from './service/crypto.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CryptoIndex.name, schema: CryptoIndexSchema },
      { name: Price.name, schema: PriceSchema },
    ]),
    HttpModule,
  ],
  providers: [CryptoGateway, CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
