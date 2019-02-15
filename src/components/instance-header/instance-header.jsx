import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import ipc from 'hadron-ipc';
import map from 'lodash.map';
import filter from 'lodash.filter';

import classnames from 'classnames';
import styles from './instance-header.less';

class InstanceHeader extends PureComponent {
  static displayName = 'InstanceHeader';

  static propTypes = {
    name: PropTypes.string.isRequired,
    sidebarCollapsed: PropTypes.bool.isRequired,
    activeNamespace: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.setupHeaderItems();
  }


  /**
   * creates React components for the plugins registering as the
   * Heeader.Item role. Separates left/right aligned items, and passes the
   * order into the css style so that flexbox can handle ordering.
   */
  setupHeaderItems() {
    const roles = global.hadronApp.appRegistry.getRole('Header.Item');
    // create all left-aligned header items
    this.leftHeaderItems = map(filter(roles, (role) => {
      return role.alignment === 'left';
    }), (role, i) => {
      return React.createElement(role.component, { key: i });
    });
    // create all right-aligned header items
    this.rightHeaderItems = map(filter(roles, (role) => {
      return role.alignment !== 'left';
    }), (role, i) => {
      return React.createElement(role.component, { key: i });
    });
  }

  handleClickHostname() {
    const NamespaceStore = global.hadronApp.appRegistry.getStore('App.NamespaceStore');
    NamespaceStore.ns = '';
    ipc.call('window:hide-collection-submenu');
  }

  /**
   * Render Component.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    const collapsed = this.props.sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded';
    const headerClasses = classnames(styles['instance-header'], styles[`instance-header-${collapsed}`]);

    const ns = this.props.activeNamespace === '' ? styles['instance-header-connection-string-is-active'] : '';
    const hostnameClasses = classnames(styles['instance-header-connection-string'], ns);

    return (
      <div className={headerClasses}>
        <div className={hostnameClasses} onClick={this.handleClickHostname.bind(this)}>
          <div className={classnames(styles['instance-header-icon-container'])}>
            <FontAwesome
              name="home"
              className={classnames(styles['instance-header-icon'], styles['instance-header-icon-home'])}
            />
          </div>
          <div
            className={classnames(styles['instance-header-details'])}
            data-test-id="instance-header-details">
            {this.props.name}
          </div>
        </div>
        <div className={classnames(styles['instance-header-items'], styles['instance-header-items-is-left'])}>
          {this.leftHeaderItems}
        </div>
        <div className={classnames(styles['instance-header-items'], styles['instance-header-items-is-right'])}>
          {this.rightHeaderItems}
        </div>
      </div>
    );
  }
}

/**
 * Map the store state to properties to pass to the components.
 *
 * @param {Object} state - The store state.
 *
 * @returns {Object} The mapped properties.
 */
const mapStateToProps = (state, ownProps) => ({
  name: state.name,
  sidebarCollapsed: ownProps.sidebarCollapsed,
  activeNamespace: state.activeNamespace
});

/**
 * Connect the redux store to the component.
 * (dispatch)
 */
const MappedInstanceHeader = connect(
  mapStateToProps,
  {
  },
)(InstanceHeader);

export default MappedInstanceHeader;
export { InstanceHeader };
