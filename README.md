# Jenkins User Stories

*Previously known as 'Jenkins is the way'*

## Deployment

* Builds are done on ci.infra.jenkins.io (VPN Needed)
* Successful builds on main branch deploy to Netlify
* Netlify site is fronted by Fastly

## Contributing

### Running Local Development Server

1. Install Node.js (Preferably the version in .tool-version or newer)
2. Run `npm install` to install dependencies
3. Run `npm run develop` to start the development server
4. Access the site at http://localhost:8000

### Code Formatting

- Run `npm run format` to format code according to project standards
- Run `npm run format-check` to verify formatting without making changes
- Run `npm run lint` to check for code issues

### Contributing Content

- https://stories.jenkins.io/admin/
