@Library('defra-library@0.0.9')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def registry = '562955126301.dkr.ecr.eu-west-2.amazonaws.com'
def regCredsId = 'ecr:eu-west-2:ecr-user'
def kubeCredsId = 'FFCLDNEKSAWSS001_KUBECONFIG'
def imageName = 'ffc-demo-claim-service'
def repoName = 'ffc-demo-claim-service'
def pr = ''
def mergedPrNo = ''
def containerTag = ''
def sonarQubeEnv = 'SonarQube'
def sonarScanner = 'SonarScanner'
def containerSrcFolder = '\\/usr\\/src\\/app'
def localSrcFolder = '.'
def lcovFile = './test-output/lcov.info'
def timeoutInMinutes = 5

node {
  checkout scm
  try {
    stage('Set branch, PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(repoName)
      defraUtils.setGithubStatusPending()
    }
    stage('Helm lint') {
      defraUtils.lintHelm(imageName)
    }
    stage('Build test image') {
      defraUtils.buildTestImage(imageName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(imageName, BUILD_NUMBER)
    }
    stage('Create Test Report JUnit'){
      defraUtils.createTestReportJUnit()
    }
    stage('Fix absolute paths in lcov file') {
      defraUtils.replaceInFile(containerSrcFolder, localSrcFolder, lcovFile)
    }
    stage('SonarQube analysis') {
      defraUtils.analyseCode(sonarQubeEnv, sonarScanner, ['sonar.projectKey' : repoName, 'sonar.sources' : '.'])
    }
    stage("Code quality gate") {
      defraUtils.waitForQualityGateResult(timeoutInMinutes)
    }
    stage('Push container image') {
      defraUtils.buildAndPushContainerImage(regCredsId, registry, imageName, containerTag)
    }
    if (pr != '') {
      stage('Helm install') {
        withCredentials([
          string(credentialsId: 'messageQueueHostPR', variable: 'messageQueueHost'),
          usernamePassword(credentialsId: 'calculationSendPR', usernameVariable: 'calculationQueueUsername', passwordVariable: 'calculationQueuePassword'),
          usernamePassword(credentialsId: 'scheduleSendPR', usernameVariable: 'scheduleQueueUsername', passwordVariable: 'scheduleQueuePassword'),
          string(credentialsId: 'postgresExternalNameClaimsPR', variable: 'postgresExternalName'),
          usernamePassword(credentialsId: 'postgresClaimsPR', usernameVariable: 'postgresUsername', passwordVariable: 'postgresPassword'),
        ]) {

          def helmValues = [
            /container.calculationQueuePassword="$calculationQueuePassword"/,
            /container.calculationQueueUser="$calculationQueueUsername"/,
            /container.messageQueueHost="$messageQueueHost"/,
            /container.redeployOnChange="$pr-$BUILD_NUMBER"/,
            /container.scheduleQueuePassword="$scheduleQueuePassword"/,
            /container.scheduleQueueUser="$scheduleQueueUsername"/,
            /postgresExternalName="$postgresExternalName"/,
            /postgresPassword="$postgresPassword"/,
            /postgresUsername="$postgresUsername"/
          ].join(',')

          def extraCommands = [
            "--values ./helm/ffc-demo-claim-service/jenkins-aws.yaml",
            "--set $helmValues"
          ].join(' ')

          defraUtils.deployChart(kubeCredsId, registry, imageName, containerTag, extraCommands)
        }
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(registry, imageName, containerTag)
      }
      stage('Trigger Deployment') {
        withCredentials([
          string(credentialsId: 'JenkinsDeployUrl', variable: 'jenkinsDeployUrl'),
          string(credentialsId: 'ffc-demo-claim-service-deploy-token', variable: 'jenkinsToken')
        ]) {
          defraUtils.triggerDeploy(jenkinsDeployUrl, 'ffc-demo-claim-service-deploy', jenkinsToken, ['chartVersion':'1.0.0'])
        }
      }
    }
    if (mergedPrNo != '') {
      stage('Remove merged PR') {
        defraUtils.undeployChart(kubeCredsId, imageName, mergedPrNo)
      }
    }
    defraUtils.setGithubStatusSuccess()
  } catch(e) {
    defraUtils.setGithubStatusFailure(e.message)
    throw e
  } finally {
    defraUtils.deleteTestOutput(imageName)
  }
}
