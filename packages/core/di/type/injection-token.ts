import { constructor } from './constructor';

export type InjectionToken<T = any> = constructor<T> | string | symbol;
