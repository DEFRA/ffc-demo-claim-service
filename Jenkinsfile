@Library('defra-library@v-8') _

def config = [ environment: 'dev' ]
def containerSrcFolder = '\/home\/node'
def nodeDevelopmentImage = 'defradigital/node-development'
def localSrcFolder = '.'
def lcovFile = './test-output/lcov.info'
def repoName = ''
def pr = ''
def tag = ''
def mergedPrNo = ''

node {
  try {
    stage('Checkout source code') {
      build.checkoutSourceCode()
    }

    stage('Set PR, and tag variables') {
      (repoName, pr, tag, mergedPrNo) = build.getVariables(version.getPackageJsonVersion())
    }

    if (pr != '') {
      stage('Verify version incremented') {
        version.verifyPackageJsonIncremented()
      }
    }

    stage('Helm lint') {
      test.lintHelm(repoName)
    }

    stage('npm audit') {
      build.npmAudit(config.npmAuditLevel, config.npmAuditLogType, config.npmAuditFailOnIssues, nodeDevelopmentImage, containerSrcFolder)
    }

    stage('Snyk test') {
      build.snykTest(config.snykFailOnIssues, config.snykOrganisation, config.snykSeverity)
    }

    stage('Build test image') {
      build.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, BUILD_NUMBER, tag)
    }

    /* stage('Run tests') { */
    /*   build.runTests(repoName, repoName, BUILD_NUMBER, tag) */
    /* } */

    /* stage('Create JUnit report') { */
    /*   test.createJUnitReport() */
    /* } */

    /* stage('Fix lcov report') { */
    /*   utils.replaceInFile(containerSrcFolder, localSrcFolder, lcovFile) */
    /* } */

    /* stage('SonarCloud analysis') { */
    /*   test.analyseNodeJsCode(SONARCLOUD_ENV, SONAR_SCANNER, repoName, BRANCH_NAME, pr) */
    /* } */

    stage('Build & push container image') {
      build.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, tag)
    }

    if (pr != '') {
      stage('Helm install') {
        helm.deployChart(config.environment, DOCKER_REGISTRY, repoName, tag)
      }
    }
    else {
      stage('Publish chart') {
        helm.publishChart(DOCKER_REGISTRY, repoName, tag, HELM_CHART_REPO_TYPE)
      }

      stage('Trigger GitHub release') {
        withCredentials([
          string(credentialsId: 'github-auth-token', variable: 'gitToken')
        ]) {
          release.trigger(tag, repoName, tag, gitToken)
        }
      }

      stage('Trigger Deployment') {
        withCredentials([
          string(credentialsId: "$repoName-deploy-token", variable: 'jenkinsToken')
        ]) {
          deploy.trigger(JENKINS_DEPLOY_SITE_ROOT, repoName, jenkinsToken, ['chartVersion': tag, 'environment': config.environment, 'helmChartRepoType': HELM_CHART_REPO_TYPE])
        }
      }
    }
  } catch(e) {
    def errMsg = utils.getErrorMessage(e)
    echo("Build failed with message: $errMsg")

    stage('Send build failure slack notification') {
      notifySlack.buildFailure(errMsg, '#generalbuildfailures')
    }
      throw e
    } finally {
      stage('Clean up test output') {
        test.deleteOutput(nodeDevelopmentImage, containerSrcFolder)
      }
    }
  }
