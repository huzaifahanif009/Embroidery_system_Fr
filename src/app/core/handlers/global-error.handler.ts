import { ErrorHandler, inject, Injectable, NgZone } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private toast = inject(ToastService);
    private zone = inject(NgZone);

    handleError(error: any): void {

        // Run inside Angular zone so toast renders properly
        this.zone.run(() => {

            // Unwrap promise rejections
            const err = error?.rejection ?? error;

            // Get a clean message
            const message = err?.message || err?.toString() || 'An unexpected error occurred.';

            // Skip chunk load errors (lazy loading) — just reload
            if (message.includes('ChunkLoadError') || message.includes('Loading chunk')) {
                window.location.reload();
                return;
            }

            // Log to console for debugging
            console.error('[GlobalErrorHandler]', err);

            // Show toast
            this.toast.error('Unexpected Error', message);
        });
    }
}