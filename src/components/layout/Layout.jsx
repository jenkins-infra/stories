import { Outlet, useLocation, useMatches } from 'react-router-dom';
import { useEffect } from 'react';
import JioNavbar from './JioNavbar';
import JioFooter from './JioFooter';

const SITE_URL = 'https://stories.jenkins.io';
const GITHUB_REPO = 'jenkins-infra/stories';
const GITHUB_BRANCH = 'main';

function Layout() {
  const matches = useMatches();
  const location = useLocation();
  const sourcePath = matches.reduce(
    (acc, match) => match.data?.sourcePath ?? acc,
    null,
  );

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <JioNavbar property={SITE_URL} />
      <Outlet />
      <JioFooter
        property={SITE_URL}
        sourcePath={sourcePath}
        githubRepo={GITHUB_REPO}
        githubBranch={GITHUB_BRANCH}
      />
    </>
  );
}

export default Layout;
