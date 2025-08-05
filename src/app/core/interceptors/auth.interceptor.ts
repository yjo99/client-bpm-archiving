import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    // Skip interception for auth bypass or certain URLs
    if (environment.bypassAuth || req.url.includes('auth/login')) {
        return next(req);
    }

    const authService = inject(AuthService);
    const token = authService.getToken();

    if (token) {
        const modifiedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(modifiedReq);
    }

    return next(req);
};