import * as React from 'react';
import { MainNavigation } from '../MainNavigation';
import { SideNavigation } from '../SideNavigation';

import './Navigation.scss';

export interface Props {}

const Navigation = () => (
  <header>
    <div className="container">
      <div className="navigation__grid">
        <MainNavigation />
        <SideNavigation />
      </div>
    </div>
  </header>
);

export default Navigation;
