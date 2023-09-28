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
  private socketFunctionBindArray: any[] = [];

  private callbackManager(
    socketId: string,
    callbackName: string,
    callback: Function,
  ) {
    callback();
    const intervalId = setInterval(async () => {
      callback();
    }, 60 * 1000);

    const foundIndex = this.socketFunctionBindArray.findIndex(
      (val: any) => val.socketId === socketId && val.type === callbackName,
    );
    if (foundIndex !== -1) {
      clearInterval(this.socketFunctionBindArray[foundIndex].intervalId);
      this.socketFunctionBindArray.splice(foundIndex, 1);
    }
    this.socketFunctionBindArray.push({
      socketId: socketId,
      type: callbackName,
      intervalId: intervalId,
    });
  }

  @SubscribeMessage('getSymbols')
  async getSymbols(client: Socket, data: string) {
    client.emit(
      'getSymbols',
      await this.cryptoService.findAllAvailableCrypto(),
    );
  }

  @SubscribeMessage('getUsdValue')
  async getUsdValue(client: Socket, data: CryptoInput[]) {
    this.callbackManager(client.id, 'getUsdValue', async () =>
      client.emit('getUsdValue', await this.cryptoService.getUsdPrices(data)),
    );
  }

  @SubscribeMessage('getUsdSumedPrices')
  async getUsdSumedPrices(client: Socket, data: CryptoInput[]) {
    this.callbackManager(client.id, 'getUsdSumedPrices', async () =>
      client.emit(
        'getUsdSumedPrices',
        await this.cryptoService.getUsdValue(data),
      ),
    );
  }
}
