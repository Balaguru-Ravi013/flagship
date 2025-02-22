import type { FC } from 'react';

import type { RNSensitiveInfoOptions } from 'react-native-sensitive-info';

import type { IStore as CargoHoldStore } from '@brandingbrand/cargo-hold';
import type { Analytics } from '@brandingbrand/fsengage';
import type { FSNetworkRequestConfig } from '@brandingbrand/fsnetwork';
import type FSNetwork from '@brandingbrand/fsnetwork';

import type { Action, AnyAction, Store } from 'redux';

import type { GenericState, StoreConfig } from '../legacy/store';
import type { FSRouter, RouterConfig, Routes } from '../router';
import type { ShellConfig } from '../shell.web';
import type { GlobalStateConfig } from '../store';

export interface WebApplication {
  readonly element: JSX.Element;
  getStyleElement: (props?: Partial<React.StyleHTMLAttributes<HTMLStyleElement>>) => JSX.Element;
}

export interface AppConfig<
  S extends GenericState | undefined = GenericState,
  A extends Action | undefined = AnyAction,
  C = any
> {
  readonly version: string;
  readonly root?: Element | string;
  readonly serverSide?: true;
  /**
   * Only affects Web.
   *
   * If the client should hydrate server-rendered HTML.
   */
  readonly hydrate?: boolean;
  readonly analytics?: Analytics;
  readonly router: RouterConfig;
  readonly webShell?: ShellConfig;
  readonly remote?: FSNetworkRequestConfig;

  /**
   * @deprecated Use cargoHold instead
   */
  readonly state?: S extends GenericState
    ? A extends Action
      ? StoreConfig<S, A>
      : undefined
    : undefined;

  readonly cargoHold?: GlobalStateConfig<C>;

  readonly sInfoOptions?: RNSensitiveInfoOptions;
  readonly getInitialURL?: () => Promise<string | null>;
  readonly onDestroy?: () => void;
  readonly provider?: FC;
}

export interface IApp {
  readonly version: string;
  readonly config: AppConfig;
  readonly routes: Routes;
  readonly store?: Store;
  readonly cargoHold?: CargoHoldStore;
  openUrl: (url: string) => void;
  startApplication: () => Promise<void>;
  stopApplication: () => Promise<void>;
}

export interface AppConstructor<T extends IApp = IApp> {
  new (
    version: string,
    config: AppConfig,
    router: FSRouter,
    api?: FSNetwork,
    cargoHold?: CargoHoldStore,
    store?: Store
  ): T;
  bootstrap: (options: AppConfig) => Promise<T>;
}
