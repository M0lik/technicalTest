import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CryptoService } from 'src/crypto/service/crypto.service';

@Injectable()
export class TasksService {
  constructor(private readonly cryptoService: CryptoService){
    this.cryptoService.findAllAvailableCrypto();
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  handleCron() {
    //todo change to a real refresh and not 'fetch if empty' behaviour
    this.cryptoService.findAllAvailableCrypto();
  }
}