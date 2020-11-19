export interface RetryError extends Error {
    retry: Promise<Object>;
}
export declare function handleRetriesFor(code: Function): Promise<{}>;
export declare function retryAfter(promise: Promise<Object>): void;
