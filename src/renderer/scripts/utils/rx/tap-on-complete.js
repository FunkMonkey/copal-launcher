import { tap } from 'rxjs/operators';

export const tapOnComplete = onCompleteCB => tap( null, null, onCompleteCB );
