pipeline {
  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    disableConcurrentBuilds(abortPrevious: true)
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
  }

  agent {
    label 'linux-arm64-docker || arm64linux'
  }

  environment {
    NODE_ENV = 'production'
    TZ = "UTC"
    // Amount of available vCPUs, to avoid OOM - https://www.gatsbyjs.com/docs/how-to/performance/resolving-out-of-memory-issues/#try-reducing-the-number-of-cores
    // https://github.com/jenkins-infra/jenkins-infra/tree/production/hieradata/clients/controller.ci.jenkins.io.yaml#L327
    GATSBY_CPU_COUNT = "4"
    // Added the below to fix permissions issue with the cache
    GATSBY_CACHE_DIR = "${env.WORKSPACE}/.gatsby-cache"
    GATSBY_INTERNAL_CACHE_DIR = "${env.WORKSPACE}/.cache"
    GATSBY_TELEMETRY_DISABLED = "1"
    NODE_OPTIONS = "--no-warnings"
  }

  stages {
    stage('Check for typos') {
      steps {
        sh '''
          curl -qsL https://github.com/crate-ci/typos/releases/download/v1.5.0/typos-v1.5.0-x86_64-unknown-linux-musl.tar.gz | tar xvzf - ./typos
          curl -qsL https://github.com/halkeye/typos-json-to-checkstyle/releases/download/v0.1.1/typos-checkstyle-v0.1.1-x86_64 > typos-checkstyle && chmod 0755 typos-checkstyle
          ./typos --format json | ./typos-checkstyle - > checkstyle.xml || true
        '''
      }
      post {
        always {
          recordIssues(tools: [checkStyle(id: 'typos', name: 'Typos', pattern: 'checkstyle.xml')])
        }
      }
    }

    stage('Install Dependencies') {
      environment {
        NODE_ENV = 'development'
      }
      steps {
        sh 'asdf install'
        sh 'npm ci'
      }
    }

    stage('Lint and Test') {
      environment {
        NODE_ENV = "development"
      }
      steps {
        sh 'npm run lint && npx eslint --format checkstyle > eslint.json'
      }
      post {
        always {
          recordIssues(tools: [esLint(pattern: 'eslint.json')])
        }
      }
    }

    stage('Build PR') {
      when { changeRequest() }
      environment {
        NODE_ENV = 'development'
      }
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy PR to preview site') {
      when {
        allOf{
          changeRequest target: 'main'
          // Only deploy to production from infra.ci.jenkins.io
          expression { infra.isInfra() }
        }
      }
      environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify-auth-token')
      }
      steps {
        sh 'netlify-deploy --draft=true --siteName "jenkins-is-the-way" --title "Preview deploy for ${CHANGE_ID}" --alias "deploy-preview-${CHANGE_ID}" -d ./public'
      }
      post {
        success {
          recordDeployment('jenkins-infra', 'stories', pullRequest.head, 'success', "https://deploy-preview-${CHANGE_ID}--jenkins-is-the-way.netlify.app")
        }
        failure {
          recordDeployment('jenkins-infra', 'stories', pullRequest.head, 'failure', "https://deploy-preview-${CHANGE_ID}--jenkins-is-the-way.netlify.app")
        }
      }
    }

    stage('Build Production') {
      when {
        branch "main"
      }
      environment {
        GATSBY_MATOMO_SITE_ID = "2"
        GATSBY_MATOMO_SITE_URL = "https://jenkins-matomo.do.g4v.dev"
      }
      steps {
        sh 'npm run build'
      }
    }

    stage('Deploy Production') {
      when {
        allOf {
          branch "main"
          // Only deploy to production from infra.ci.jenkins.io
          expression { infra.isInfra() }
        }
      }
      environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify-auth-token')
      }
      steps {
        sh 'netlify-deploy --draft=false --siteName "jenkins-is-the-way" --title "Deploy" -d ./public'
      }
      post {
        success {
          recordDeployment('jenkins-infra', 'stories', env.GIT_COMMIT, 'success', 'https://jenkins-is-the-way.netlify.app', [environment: 'production'])
        }
        failure {
          recordDeployment('jenkins-infra', 'stories', env.GIT_COMMIT, 'failure', 'https://jenkins-is-the-way.netlify.app', [environment: 'production'])
        }
      }
    }
  }
}
