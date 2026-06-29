import { Outlet, useMatches } from 'react-router-dom';
import JioNavbar from './JioNavbar';
import JioFooter from './JioFooter';

const SITE_URL = 'https://stories.jenkins.io';
const GITHUB_REPO = 'jenkins-infra/stories';
const GITHUB_BRANCH = 'main';

function Layout() {
  const matches = useMatches();
  const sourcePath = matches.reduce((acc, match) => match.data?.sourcePath ?? acc, null);

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
