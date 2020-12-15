import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { ConfigModule } from '@nestjs/config';

const CACHE_TTL = 2 * 60;

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    CacheModule.register({ ttl: CACHE_TTL }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
