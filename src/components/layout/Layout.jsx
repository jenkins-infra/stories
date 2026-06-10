import { Outlet } from 'react-router-dom';
import JioNavbar from './JioNavbar';
import JioFooter from './JioFooter';

function Layout() {
  return (
    <>
      <JioNavbar property="https://stories.jenkins.io" />
      <Outlet />
      <JioFooter property="https://stories.jenkins.io" />
    </>
  );
}

export default Layout;
