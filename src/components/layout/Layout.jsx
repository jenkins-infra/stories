import { Outlet } from 'react-router-dom';
import JioNavbar from './JioNavbar';
import JioFooter from './JioFooter';

function Layout() {
  const property = 'https://stories.jenkins.io';
  return (
    <>
      <JioNavbar property={property} />
      <Outlet />
      <JioFooter property={property} />
    </>
  );
}

export default Layout;
