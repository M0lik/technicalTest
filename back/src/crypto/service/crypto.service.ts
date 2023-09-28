import { Inject, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CryptoInput } from '../dto/request/CryptoInput.request.dto';
import { CryptoIndex } from '../schema/index.schema';
import { Price } from '../schema/price.schema';
import { CryptoIndexResponseDto } from '../dto/response/CryptoIndex.response.dto';

@Injectable()
export class CryptoService {
  @Inject() private readonly httpService: HttpService;

  @InjectModel(CryptoIndex.name)
  private readonly CryptoIndexModel: Model<CryptoIndex>;

  @InjectModel(Price.name) private readonly PriceModel: Model<Price>;

  async findAllAvailableCrypto(): Promise<CryptoIndexResponseDto[]> {
    const result = await this.CryptoIndexModel.find().exec();
    if (result.length > 0) {
      return result.map((e) => CryptoIndexResponseDto.fromEntity(e));
    }

    const response = await this.httpService.axiosRef.get<
      AxiosResponse<CryptoIndex[]>
    >('https://api.coingecko.com/api/v3/coins/list');
    const data: any = response.data;
    const promises = data.map(async (e) => {
      const newData = new this.CryptoIndexModel(e);
      await newData.save();
    });
    await Promise.all(promises);
    return data.map((e) => CryptoIndexResponseDto.fromEntity(e));
  }

   async getCryptoUSDValue(id: string): Promise<number> {
    const cryptoId = await this.CryptoIndexModel.findOne({
      id: id,
    }).exec();
    if (!cryptoId) {
      throw new Error(`Crypto symbol ${id} seems to be invalid.`);
    }

    const currencyResponse = 'usd';
    var lastminute = new Date();
    lastminute.setMinutes(lastminute.getMinutes() - 1);

    const priceFromDb = await this.PriceModel.findOne({
      createdAt: { $gte: lastminute.toISOString() },
    });

    if (!priceFromDb) {
      const response = await this.httpService.axiosRef.get(
        `https://api.coingecko.com/api/v3/coins/${cryptoId.id}`,
      );
      const newData = new this.PriceModel({
        id: cryptoId.id,
        currency: cryptoId,
        usdPrice: response.data.market_data.current_price[currencyResponse],
      });
      await newData.save();
      return Number(response.data.market_data.current_price[currencyResponse]);
    }
    return Number(priceFromDb.usdPrice);
  }

  async getUsdValue(data: CryptoInput[]) {
    const promises = data.map(
      async (e) => (await this.getCryptoUSDValue(e.name)) * e.value,
    );
    const resultArray = await Promise.all(promises);
    const globalSum = resultArray.reduce((x, y) => x + y);
    return globalSum;
  }

  async getUsdPrices(data: CryptoInput[]) {
    const promises = data.map(async (e) => {
      const unitaryPrice = await this.getCryptoUSDValue(e.name);
      return {
        symbol: e.name,
        unitaryPrice,
        totalPrice: e.value * unitaryPrice,
      };
    });
    const resultArray = await Promise.all(promises);
    return resultArray;
  }
}
