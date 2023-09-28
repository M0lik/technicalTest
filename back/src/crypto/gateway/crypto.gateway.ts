import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject } from '@nestjs/common';
import { CryptoInput } from '../dto/request/CryptoInput.request.dto';
import { CryptoService } from '../service/crypto.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class CryptoGateway {
  @Inject() private readonly cryptoService: CryptoService;

  @SubscribeMessage('getSymbols')
  async getSymbols(client: Socket, data: string) {
    client.emit(
      'getSymbols',
      await this.cryptoService.findAllAvailableCrypto(),
    );
  }

  @SubscribeMessage('getUsdValue')
  async getCryptolist(client: Socket, data: CryptoInput[]) {
    client.emit('getUsdValue', await this.cryptoService.getUsdPrices(data));
  }

  @SubscribeMessage('getUsdSumedPrices')
  async getUsdSumedPrices(client: Socket, data: CryptoInput[]) {
    client.emit(
      'getUsdSumedPrices',
      await this.cryptoService.getUsdValue(data),
    );
  }
}
