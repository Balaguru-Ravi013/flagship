import type { Branded } from '@brandingbrand/standard-branded';
import type {
  Parser,
  ParserArgs,
  ParserOk,
  ParserResult,
  WithCursorEnd,
  WithFatalError,
  WithValue,
} from '@brandingbrand/standard-parser';
import type { Failure, Ok, Result } from '@brandingbrand/standard-result';

import type { COMBINATOR_BRANDING } from './combinator.constants';

export type CombinatorBase = Branded<Required<ParserArgs>, typeof COMBINATOR_BRANDING>;

export type CombinatorParserResults =
  | [...Array<ParserOk<unknown>>, ParserResult<unknown>]
  | [ParserResult<unknown>];

/**
 * Utility types for composition
 */
export type WithResults = Record<'results', CombinatorParserResults>;

export type CombinatorOk<T, V = T> = Ok<
  CombinatorBase & WithCursorEnd & WithResults & WithValue<V>
>;

export type CombinatorFailure = Failure<CombinatorBase & Partial<WithFatalError> & WithResults>;

export type CombinatorResult<T, V = T> = Result<
  CombinatorOk<T, V>['ok'],
  CombinatorFailure['failure']
>;

/**
 *
 */
export type Combinator<T, V = T, ParsersT extends Array<Parser<T>> = Array<Parser<T>>> = (
  ...parsers: ParsersT
) => (args: ParserArgs) => CombinatorResult<T, V>;

export type CombinatorConstructor<
  T,
  V = T,
  ParsersT extends Array<Parser<T>> = Array<Parser<T>>,
  ParamsT extends unknown[] = Array<Parser<T>>
> = (...params: ParamsT) => Combinator<T, V, ParsersT>;
