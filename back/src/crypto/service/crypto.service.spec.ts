import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from './crypto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Price, PriceSchema } from '../schema/price.schema';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from '../../test/utils/inMemoryMongo';
import { HttpModule, HttpService } from '@nestjs/axios';
import { CryptoIndex, CryptoIndexSchema } from '../schema/index.schema';
import { CryptoIndexResponseDto } from '../dto/response/CryptoIndex.response.dto';
import { Model, model } from 'mongoose';

describe('CryptoService', () => {
  let service: CryptoService;
  let httpService: HttpService;
  let module: TestingModule;
  let mongooseModule: MongooseModule;
  let cryptoIndexModel: Model<CryptoIndex>;
  let priceModel: Model<Price>;
  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: CryptoIndex.name, schema: CryptoIndexSchema },
          { name: Price.name, schema: PriceSchema },
        ]),
      ],
      providers: [
        CryptoService,
        {
          provide: HttpService,
          useValue: { axiosRef: { get: () => {} } },
        },
      ],
    }).compile();

    cryptoIndexModel = module.get<Model<CryptoIndex>>('CryptoIndexModel');
    priceModel = module.get<Model<Price>>('PriceModel');
    httpService = module.get<HttpService>(HttpService);
    mongooseModule = module.get<MongooseModule>(MongooseModule);
    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find available crypto list', async () => {
    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({
      data: [new CryptoIndexResponseDto()],
    });

    expect(
      (await service.findAllAvailableCrypto()).every((x) => {
        return x instanceof CryptoIndexResponseDto;
      }),
    ).toBeTruthy();
  });

  it('should throw from invalid symbol', async () => {
    await expect(service.getCryptoUSDValue('invalidSymbol')).rejects.toThrow(
      'Crypto symbol invalidSymbol seems to be invalid.',
    );
  });

  it('should call for a price', async () => {
    await cryptoIndexModel.create({
      id: 'eth',
      symbol: 'eth',
      name: 'eth',
      prices: [],
    });
    jest.spyOn(httpService.axiosRef, 'get').mockResolvedValueOnce({
      data: { market_data: { current_price: { usd: '300' } } },
    });
    await expect(service.getCryptoUSDValue('eth')).resolves.toBe(300);
  });

  it('should return a price but not call api for it', async () => {
    const idx = await cryptoIndexModel.create({
      id: 'eth',
      symbol: 'eth',
      name: 'eth',
      prices: [],
    });
    await priceModel.create({
      id: 'eth',
      currency: idx,
      usdPrice: 300,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const spy = jest.spyOn(httpService.axiosRef, 'get');
    expect(spy).not.toHaveBeenCalled();
    await expect(service.getCryptoUSDValue('eth')).resolves.toBe(300);
  });

  it('should return the sum value for a quantity  a crypto', async () => {
    jest.spyOn(service, 'getCryptoUSDValue').mockResolvedValueOnce(200);
    jest.spyOn(service, 'getCryptoUSDValue').mockResolvedValueOnce(300);

    expect(
      await service.getUsdValue([
        { name: 'eth', value: 2 },
        { name: 'btc', value: 3 },
      ]),
    ).toEqual(200 * 2 + 300 * 3);
  });

  it('it should return the unitary price and amount of each crypto', async () => {
    jest.spyOn(service, 'getCryptoUSDValue').mockResolvedValueOnce(200);
    jest.spyOn(service, 'getCryptoUSDValue').mockResolvedValueOnce(300);

    expect(
      await service.getUsdPrices([
        { name: 'eth', value: 2 },
        { name: 'btc', value: 3 },
      ]),
    ).toEqual([
      { symbol: 'eth', totalPrice: 2 * 200, unitaryPrice: 200 },
      { symbol: 'btc', totalPrice: 3 * 300, unitaryPrice: 300 },
    ]);
  });

  afterAll(async () => {
    await closeInMongodConnection();
    await module.close();
  });
});
