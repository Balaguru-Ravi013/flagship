import { isArray, isFunction } from 'lodash-es';

/**
 * Type representing a middleware function that accepts original and normalized data
 * and returns manipulated normalized data.
 *
 * @param data - The raw response from the request
 * @param normalized - The normalized data from the response
 * @return Normalized data containing additional manipulations
 */
export type MiddlewareFunction = (data: object, normalized: object) => unknown;

const runMiddleware = async (
  data: object,
  normalized: object,
  middleware: MiddlewareFunction | MiddlewareFunction[] | undefined
): Promise<any> => {
  if (middleware) {
    if (isMiddlewareArray(middleware)) {
      for (const fn of middleware) {
        if (isFunction(fn)) {
          normalized = await fn(data, normalized);
        } else {
          throw new Error('Middleware value must be a function');
        }
      }
    } else if (isFunction(middleware)) {
      normalized = await middleware(data, normalized);
    } else {
      throw new Error('Middleware must be a function or array of functions');
    }
  }
  return normalized;
};

const isMiddlewareArray = (
  middleware: MiddlewareFunction | MiddlewareFunction[]
): middleware is MiddlewareFunction[] => isArray(<MiddlewareFunction[]>middleware);

export default runMiddleware;
