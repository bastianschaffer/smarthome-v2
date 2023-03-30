import { CallableContextResult, EmptyObject, LongPressCallback, LongPressOptions, LongPressResult } from './types';
export declare function useLongPress<Target = Element, Context = unknown>(callback: null, options?: LongPressOptions<Target>): CallableContextResult<EmptyObject, Context>;
export declare function useLongPress<Target = Element, Callback extends LongPressCallback<Target, Context> = LongPressCallback<Target>, Context = unknown>(callback: Callback, options?: LongPressOptions<Target>): CallableContextResult<LongPressResult<Target>, Context>;
export declare function useLongPress<Target = Element, Callback extends LongPressCallback<Target, Context> = LongPressCallback<Target>, Context = unknown>(callback: Callback | null, options?: LongPressOptions<Target>): CallableContextResult<LongPressResult<Target> | EmptyObject, Context>;
export * from './types';
