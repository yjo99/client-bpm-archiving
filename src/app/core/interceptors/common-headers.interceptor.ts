import { HttpInterceptorFn } from '@angular/common/http';

export const commonHeadersInterceptor: HttpInterceptorFn = (req, next) => {
    const modifiedReq = req.clone({
        setHeaders: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'X-Application': 'YourAppName',
            'X-Version': '1.0.0'
        }
    });
    return next(modifiedReq);
};