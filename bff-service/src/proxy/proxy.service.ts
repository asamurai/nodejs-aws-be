import { HttpException, HttpService, Injectable } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ProxyService {
  constructor(private httpService: HttpService) {}

  request(url: string, { method, params, body: data }) {
    return this.httpService
      .request({
        url,
        method,
        params,
        ...(Object.keys(data).length ? { data } : {}),
      })
      .pipe(
        map((response) => response.data),
        catchError(({ response: { data, status } }) => {
          throw new HttpException(data, status);
        }),
      );
  }
}
