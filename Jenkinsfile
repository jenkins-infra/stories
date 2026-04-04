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
  stages {
    stage('load env file') {
      steps {
        // Load environment variables from .env file.
        sh '''
         set -a
         source ./.env
         set +a
         '''
      }
    }
    stage('Parallel Stage') {
      parallel {
        stage('Branch A') {
          stages {
            stage('Check for typos') {
              steps {
               sh '''
                  curl - qsL https: //github.com/crate-ci/typos/releases/download/v1.33.1/typos-v1.33.1-x86_64-unknown-linux-musl.tar.gz | tar xvzf - ./typos
                  . / typos--format sarif > typos.sarif || true 
               '''
              }
              post {
                always {
                  recordIssues(tools: [sarif(id: 'typos', name: 'Typos', pattern: 'typos.sarif')])
                }
              }
            }
            stage('Install Dependencies') {
              environment {
                NODE_ENV = 'development'
              }
              steps {
                sh 'asdf install'
                sh 'npm install'
              }
            }
            stage('Lint and Test') {
              environment {
                NODE_ENV = "development"
              }
              steps {
                sh 'npm run lint && npx eslint --format checkstyle > eslint.xml'
              }
              post {
                always {
                  recordIssues(tools: [checkStyle(pattern: 'eslint.xml')])
                }
              }
            }
            stage('Build PR') {
              when {
                changeRequest()
              }
              environment {
                NODE_ENV = 'development'
              }
              steps {
                sh 'npm run build'
              }
            }
          }
        }
        stage('Branch B') {
          agent {
            label 'linux-arm64-docker || arm64linux'
          }
          steps {
            echo 'Test Docker Compose'
            sh 'docker compose up --detach --wait'
            sh 'docker compose run --rm stories_webapp env'
            sh 'docker compose down'
          }
          post {
            always {
              sh 'docker compose down || true'
            }
          }
        }
      }
    }
    stage('Deploy PR to preview site') {
      when {
        allOf {
          changeRequest target: 'main'
          // Only deploy to production from infra.ci.jenkins.io
          expression {
            infra.isInfra()
          }
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
      steps {
        sh 'npm run build'
      }
    }
    stage('Deploy Production') {
      when {
        allOf {
          branch "main"
          // Only deploy to production from infra.ci.jenkins.io
          expression {
            infra.isInfra()
          }
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