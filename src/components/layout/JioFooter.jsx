function JioFooter({ property, sourcePath, githubRepo, githubBranch }) {
  return (
    <jio-footer
      githubRepo={sourcePath ? githubRepo : ''}
      property={property}
      sourcePath={sourcePath}
      githubBranch={githubBranch}
    ></jio-footer>
  );
}

export default JioFooter;
