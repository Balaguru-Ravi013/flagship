import { applyParam, flow, pipe } from '@brandingbrand/standard-compose';

import { createLensCreator } from './create-lens';
import type { ExtendWithPath, ILens, IPathLens } from './types';

export class ComposableLens<Structure, FocussedValue>
  implements IPathLens<Structure, FocussedValue>
{
  constructor(private readonly lens: ILens<Structure, FocussedValue>) {}

  public get = this.lens.get;
  public set = this.lens.set;

  public withInnerLens = <InnerFocussedValue>(
    lens: ILens<FocussedValue, InnerFocussedValue>
  ): ComposableLens<Structure, InnerFocussedValue> =>
    new ComposableLens<Structure, InnerFocussedValue>({
      get: flow(this.lens.get, lens.get),
      set: (value) => (structure) =>
        pipe(structure, this.lens.get, lens.set(value), this.lens.set, applyParam(structure)),
    });

  public withOuterLens = <OuterStructure>(
    lens: ILens<OuterStructure, Structure>
  ): ComposableLens<OuterStructure, FocussedValue> =>
    new ComposableLens<OuterStructure, FocussedValue>({
      get: flow(lens.get, this.lens.get),
      set: (value) => (structure) =>
        pipe(structure, lens.get, this.lens.set(value), lens.set, applyParam(structure)),
    });

  public extendWithPath: ExtendWithPath<Structure, FocussedValue> = ((...paths: PropertyKey[]) =>
    this.withInnerLens(
      (createLensCreator<FocussedValue>().fromPath as any)(...(paths as any))
    )) as ExtendWithPath<Structure, FocussedValue>;
}
