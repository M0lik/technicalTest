import { CryptoIndex } from 'src/crypto/schema/index.schema';
import { PriceResponseDto } from './Price.response.dto';

export class CryptoIndexResponseDto {
  id: string;
  symbol: string;
  name: string;
  prices: PriceResponseDto[];

  static fromEntity(entity: CryptoIndex) {
    if (entity === null) return null;
    const instance = new this();
    instance.id = entity.id;
    instance.symbol = entity.symbol;
    instance.name = entity.name;
    instance.prices =
      entity.prices && entity.prices.length > 0
        ? entity.prices.map((price) => PriceResponseDto.fromEntity(price))
        : [];
    return instance;
  }
}
