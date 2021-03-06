import "./Header.scss";

import * as React from "react";
import { SystemSettings, CurrentUser, Tenant } from "@fider/models";
import { SignInModal, SignInControl, EnvironmentInfo, Gravatar, Logo } from "@fider/components";
import { actions, classSet } from "@fider/services";

interface HeaderState {
  showSignIn: boolean;
  unreadNotifications: number;
}

export class Header extends React.Component<{}, HeaderState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      showSignIn: false,
      unreadNotifications: 0
    };
  }

  public componentDidMount(): void {
    if (Fider.session.isAuthenticated) {
      actions.getTotalUnreadNotifications().then(result => {
        if (result.ok && result.data > 0) {
          this.setState({ unreadNotifications: result.data });
        }
      });
    }
  }

  private showModal = () => {
    if (!Fider.session.isAuthenticated) {
      this.setState({ showSignIn: true });
    }
  };

  public render() {
    const items = Fider.session.isAuthenticated && (
      <div className="c-menu-user">
        <div className="c-menu-user-heading">
          <i className="user icon" />
          {Fider.session.user.name}
        </div>
        <a href="/settings" className="c-menu-user-item">
          Settings
        </a>
        <a href="/notifications" className="c-menu-user-item">
          Notifications
          {this.state.unreadNotifications > 0 && <div className="c-unread-count">{this.state.unreadNotifications}</div>}
        </a>
        <div className="c-menu-user-divider" />
        {Fider.session.user.isCollaborator && [
          <div key={1} className="c-menu-user-heading">
            <i className="setting icon" />
            Administration
          </div>,
          <a key={2} href="/admin" className="c-menu-user-item">
            Site Settings
          </a>,
          <div key={5} className="c-menu-user-divider" />
        ]}
        <a href="/signout?redirect=/" className="c-menu-user-item signout">
          Sign out
        </a>
      </div>
    );

    const showRightMenu = Fider.session.isAuthenticated || !Fider.session.tenant.isPrivate;
    return (
      <div id="c-header">
        <EnvironmentInfo />
        <SignInModal isOpen={this.state.showSignIn} />
        <div className="c-menu">
          <div className="container">
            <a href="/" className="c-menu-item-title">
              <Logo size={100} />
              <span>{Fider.session.tenant.name}</span>
            </a>
            {showRightMenu && (
              <div onClick={this.showModal} className="c-menu-item-signin">
                {Fider.session.isAuthenticated && <Gravatar user={Fider.session.user} />}
                {this.state.unreadNotifications > 0 && <div className="c-unread-dot" />}
                {!Fider.session.isAuthenticated && <span>Sign in</span>}
                {Fider.session.isAuthenticated && <i className="dropdown icon" />}
                {items}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
