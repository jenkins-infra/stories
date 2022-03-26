pipeline {
  environment {
    NODE_ENV = "development"
    HOME = "/tmp"
    TZ = "UTC"
    NETLIFY = "true"
  }
  agent {
    label 'docker&&linux'
  }


  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    disableConcurrentBuilds(abortPrevious: true)
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
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
      agent {
        docker {
          image 'node:16.13.1'
          reuseNode true
        }
      }
      steps {
        sh 'npm install'
      }
    }

    stage('Build Production') {
      agent {
        docker {
          image 'node:16.13.1'
          reuseNode true
        }
      }
      environment {
        NODE_ENV = "production"
      }
      steps {
        sh 'npm run build'
      }
    }

    stage('Lint and Test') {
      agent {
        docker {
          image 'node:16.13.1'
          reuseNode true
        }
      }
      steps {
        sh '''
          npx eslint --format checkstyle > eslint.json || true
        '''
      }
      post {
        always {
          recordIssues(tools: [esLint(pattern: 'eslint.json')])
        }
      }
    }
  }
}
