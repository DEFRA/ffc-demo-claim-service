@Library('defra-library@PSD-622-migrate-to-sonarcloud-poc')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def containerSrcFolder = '\\/home\\/node'
def containerTag = ''
def lcovFile = './test-output/lcov.info'
def localSrcFolder = '.'
def mergedPrNo = ''
def pr = '72'
def serviceName = 'ffc-demo-claim-service'
def sonarQubeEnv = 'SonarCloud'
def sonarScanner = 'SonarScanner'
def timeoutInMinutes = 5

def getExtraCommands(pr, containerTag) {
  withCredentials([
    string(credentialsId: 'sqs-queue-endpoint', variable: 'sqsQueueEndpoint'),
    string(credentialsId: 'calculation-queue-name-pr', variable: 'calculationQueueName'),
    string(credentialsId: 'schedule-queue-name-pr', variable: 'scheduleQueueName'),
    string(credentialsId: 'postgres-external-name-pr', variable: 'postgresExternalName'),
    string(credentialsId: 'claim-service-account-role-arn', variable: 'serviceAccountRoleArn'),
    usernamePassword(credentialsId: 'claims-service-postgres-user-pr', usernameVariable: 'postgresUsername', passwordVariable: 'postgresPassword'),
  ]) {
    def helmValues = [
      /container.calculationQueueEndpoint="$sqsQueueEndpoint"/,
      /container.calculationQueueName="$calculationQueueName"/,
      /container.scheduleQueueEndpoint="$sqsQueueEndPoint"/,
      /container.scheduleQueueName="$scheduleQueueName"/,
      /container.redeployOnChange="$pr-$BUILD_NUMBER"/,
      /postgresExternalName="$postgresExternalName"/,
      /postgresPassword="$postgresPassword"/,
      /postgresUsername="$postgresUsername"/,
      /serviceAccount.roleArn="$serviceAccountRoleArn"/,
      /labels.version="$containerTag"/
    ].join(',')

    return [
      "--values ./helm/ffc-demo-claim-service/jenkins-aws.yaml",
      "--set $helmValues"
    ].join(' ')
  }
}

node {
  checkout scm
  try {
    stage('Set GitHub status as pending'){
      defraUtils.setGithubStatusPending()
    }
    stage('Set branch, PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(serviceName, defraUtils.getPackageJsonVersion())
    }
    stage('Helm lint') {
      defraUtils.lintHelm(serviceName)
    }
    stage('Build test image') {
      defraUtils.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(serviceName, serviceName, BUILD_NUMBER)
    }
    stage('Create Test Report JUnit'){
      defraUtils.createTestReportJUnit()
    }
    stage('Fix absolute paths in lcov file') {
      defraUtils.replaceInFile(containerSrcFolder, localSrcFolder, lcovFile)
    }
    stage("SonarCloud code quality gate") {
      defraUtils.waitForQualityGateResult(timeoutInMinutes)
    }
    stage('Push container image') {
      defraUtils.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, containerTag)
    }
    if (pr != '') {
      stage('Verify version incremented') {
        defraUtils.verifyPackageJsonVersionIncremented()
      }
      stage('Helm install') {
        defraUtils.deployChart(KUBE_CREDENTIALS_ID, DOCKER_REGISTRY, serviceName, containerTag, getExtraCommands(pr, containerTag))
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(DOCKER_REGISTRY, serviceName, containerTag)
      }
      stage('Trigger GitHub release') {
        withCredentials([
          string(credentialsId: 'github-auth-token', variable: 'gitToken')
        ]) {
          defraUtils.triggerRelease(containerTag, serviceName, containerTag, gitToken)
        }
      }
      stage('Trigger Deployment') {
        withCredentials([
          string(credentialsId: 'claim-service-deploy-token', variable: 'jenkinsToken'),
          string(credentialsId: 'claim-service-job-deploy-name', variable: 'deployJobName')
        ]) {
          defraUtils.triggerDeploy(JENKINS_DEPLOY_SITE_ROOT, deployJobName, jenkinsToken, ['chartVersion': containerTag])
        }
      }
    }
    if (mergedPrNo != '') {
      stage('Remove merged PR') {
        defraUtils.undeployChart(KUBE_CREDENTIALS_ID, serviceName, mergedPrNo)
      }
    }
    stage('Set GitHub status as success'){
      defraUtils.setGithubStatusSuccess()
    }
  } catch(e) {
    defraUtils.setGithubStatusFailure(e.message)
    defraUtils.notifySlackBuildFailure(e.message, "#generalbuildfailures")
    throw e
  } finally {
    defraUtils.deleteTestOutput(serviceName, containerSrcFolder)
  }
}
