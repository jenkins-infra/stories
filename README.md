# Jenkins User Stories

Previously known as Jenkins is the way. This project showcases real-world Jenkins user stories.

This repository powers the Jenkins User Stories website (https://stories.jenkins.io), 
highlighting how organizations use Jenkins to automate workflows, improve CI/CD pipelines, 
and scale their development processes.

---

## Table of Contents

- [About](#about)
- [Deployment](#deployment)
- [Development Setup](#development-setup)
- [Getting Started](#getting-started)
- [Code Quality Tools](#code-quality-tools)
- [Contributing Guidelines](#contributing-guidelines)
- [Contribution Workflow](#contribution-workflow)
- [Adding a New User Story](#adding-a-new-user-story)
- [Related Links](#related-links)

---

## About

This project contains curated success stories from companies and developers using Jenkins in real-world scenarios.  
It serves as a reference for best practices, use cases, and real implementations across industries.

---

## Deployment

### Deployment Workflow (to be done by Infra or a maintainer)

* Builds are done on `ci.infra.jenkins.io` (VPN needed)
* Successful builds on main branch deploy to Netlify
* Netlify site is fronted by Fastly

For historical record, the admin portal can be reached via:
https://stories.jenkins.io/admin/

---

## Development Setup

### System Requirements

* Node.js (Recommended: Match version in `.tool-versions`)
* npm

---

## Getting Started

First, fork the repository and clone it.

```bash
git clone <url-from-github>
```

Change directory:

```bash
cd stories
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run develop
```

Open http://localhost:8000 on your browser to see the result.

---

## Code Quality Tools

### Formatting

Ensure consistent code style:

```bash
npm run format
```

---

## Contributing Guidelines

1. Create feature branches  
2. Write clear commit messages  
3. Run formatters before submitting PRs  
4. Follow existing structure and naming conventions  

---

## Contribution Workflow

1. Fork the repository  
2. Create a feature branch (`feature/story-name`)  
3. Make your changes  
4. Run formatting (`npm run format`)  
5. Add your changes and commit with a clear message  
6. Push your changes to GitHub  
7. Submit a pull request  

---

## Adding a New User Story

We encourage Jenkins users and organizations to share their real-world success stories.

### Step 1: Submit Your Story Idea

Create a new issue using the official template: [Create a new User Story issue](https://github.com/jenkins-infra/stories/issues/new?title=User+Success+Story&labels=success-story&body=%23%23%23+Title++%0A_enter+the+title+for+your+success+story_%0A%0A%23%23%23+Story+Summary++%0A_give+a+short+summary+of+your+success+story_%0A%0A%23%23%23+_Next+Steps_++%0A_After+submitting+this+issue%2C+please+create+a+PR+adding+your+full+success+story+at%3A++%60%2Fsrc%2Fuser-story%2F%5Bstory-title%5D%2Findex.yaml%60++%0AAlso%2C+include+any+related+images+in+the+same+directory._)

This will guide you to:
- Add a title for your story  
- Provide a short summary  
- Understand the next steps for contribution  

### Step 2: Create a Pull Request

After submitting the issue:

1. Add your full story in:  
   `/src/user-story/[story-title]/index.yaml`  
2. Follow the existing YAML structure  
3. Include relevant images (if any)  
4. Submit a pull request  

💡 Tip: Check existing stories on https://stories.jenkins.io/ for examples before contributing.

---

## Related Links

- Jenkins Website: https://www.jenkins.io/  
- Documentation: https://www.jenkins.io/doc/  
- Jenkins GitHub: https://github.com/jenkinsci/jenkins  
- User Stories Site: https://stories.jenkins.io/  

---

## Notes

- Ensure your story is clear, concise, and structured  
- Avoid promotional language; focus on real technical impact  
- Follow formatting and contribution guidelines strictly  
