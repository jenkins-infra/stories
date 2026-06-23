function JioFooter({ property, sourcePath, githubRepo, githubBranch, reportAProblemTemplate }) {
  return (
    <jio-footer
      githubRepo={sourcePath ? githubRepo : ''}
      property={property}
      sourcePath={sourcePath}
      githubBranch={githubBranch}
      reportAProblemTemplate={reportAProblemTemplate}
    ></jio-footer>
  );
}

export default JioFooter;
