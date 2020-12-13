import {
  All,
  CacheInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('product/products')
  @UseInterceptors(CacheInterceptor)
  cachedProductsProxy(@Req() request: Request) {
    return this.proxyService.request(
      `${process.env.product}/products`,
      request,
    );
  }

  @All()
  proxy(@Req() request: Request) {
    const [serviceName, ...apiPath] = request.url.split('/').filter(Boolean);
    const apiEndpoint = process.env[serviceName];

    if (!apiEndpoint) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }

    return this.proxyService.request(
      `${apiEndpoint}/${apiPath.join('/')}`,
      request,
    );
  }
}
