import { Price } from 'src/crypto/schema/price.schema';
import { CryptoIndexResponseDto } from './CryptoIndex.response.dto';

export class PriceResponseDto {
  id: string;
  currency: CryptoIndexResponseDto;
  usdPrice: number;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: Price) {
    if (entity === null) return null;
    const instance = new this();
    instance.id = entity.id;
    instance.currency = CryptoIndexResponseDto.fromEntity(entity.currency);
    instance.usdPrice = entity.usdPrice;
    instance.createdAt = instance.createdAt;
    instance.updatedAt = instance.updatedAt;
    return instance;
  }
}
