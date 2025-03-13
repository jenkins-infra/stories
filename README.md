# Jenkins User Stories

Previously known as Jenkins is the way. This project showcases real-world Jenkins user stories.

## Deployment

### Deployment Workflow (to be done by Infra or a maintainer)

- Builds are conducted on `ci.infra.jenkins.io`
- **VPN Access Required**

> A VPN connection is mandatory to access the build infrastructure.

### Deployment Workflow

- Automatic deployment to Netlify for main branch builds
- Fastly provides frontend caching and performance optimization

## Development Setup

### System Requirements

- Node.js (Recommended: Match version in `.tool-versions`)
- npm (Node Package Manager)

## Getting Started

First, fork the repository and clone it.

```bash
git clone https://github.com/<username>/stories.git
```

Change Directory

```bash
cd stories
```

Install Dependencies

```bash
npm install
```

Run the development server:

```bash
npm run develop

```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

## Code Quality Tools

### Formatting

Ensure consistent code style:

```bash
npm run format
```

## Contributing Guidelines

1. Create feature branches
2. Write clear commit messages
3. Run formatters before submitting PRs

## Contribution Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run formatters
5. Submit a pull request

## Additional Resources

- [Jenkins Official Website](https://www.jenkins.io/)
