/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// @flow

import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducers from './reducers';
import type { Store } from './types/store';

/**
 * Isolate the store creation into a function, so that it can be used outside of the
 * app's execution context, e.g. for testing.
 * @return {object} Redux store.
 */
export default function initializeStore(): Store {
  const middlewares = [thunk];

  if (process.env.NODE_ENV === 'development') {
    middlewares.push(
      createLogger({
        titleFormatter: action => `content action ${action.type}`,
      })
    );
  }

  const store = createStore(reducers, applyMiddleware(...middlewares));

  return store;
}
