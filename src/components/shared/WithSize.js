/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
// @flow

import * as React from 'react';
import { findDOMNode } from 'react-dom';
import type { CssPixels } from '../../types/units';

export type SizeProps = {|
  width: CssPixels,
  height: CssPixels,
|};

/**
 * Wraps a React component and makes 'width' and 'height' available in the
 * wrapped component's props. These props start out at zero and are updated to
 * the component's DOM node's getBoundingClientRect().width/.height after the
 * component has been mounted. They also get updated when the window is
 * resized.
 *
 * Note that the props are *not* updated if the size of the element changes
 * for reasons other than a window resize.
 */
export function withSize<WrappedProps: Object>(
  Wrapped: React.ComponentType<{ ...WrappedProps, ...SizeProps }>
): React.ComponentType<{ ...WrappedProps }> {
  return class WithSizeWrapper extends React.PureComponent<*, SizeProps> {
    _resizeListener: Event => void;
    state = { width: 0, height: 0 };

    _observeSize = (
      wrappedComponent: React.Component<{ ...WrappedProps, ...SizeProps }>
    ) => {
      if (!wrappedComponent) {
        return;
      }
      const container = findDOMNode(wrappedComponent); // eslint-disable-line react/no-find-dom-node
      if (!container) {
        throw new Error('Unable to find the DOMNode');
      }
      this._resizeListener = () => {
        this._updateWidth(container);
      };
      window.addEventListener('resize', this._resizeListener);
      this._updateWidth(container);
    };

    componentWillUnmount() {
      window.removeEventListener('resize', this._resizeListener);
    }

    _updateWidth(container: Element | Text) {
      if (typeof container.getBoundingClientRect !== 'function') {
        throw new Error('Cannot measure a Text node.');
      }
      const { width, height } = container.getBoundingClientRect();
      this.setState({ width, height });
    }

    render() {
      return (
        <Wrapped ref={this._observeSize} {...this.props} {...this.state} />
      );
    }
  };
}
