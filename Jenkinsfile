@Library('defra-library@1.0.0')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def registry = '171014905211.dkr.ecr.eu-west-2.amazonaws.com'
def regCredsId = 'ecr:eu-west-2:ecr-user'
def kubeCredsId = 'FFCLDNEKSAWSS001_KUBECONFIG'
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
    stage('Set GitHub status as pending'){
      defraUtils.setGithubStatusPending()
    }  
    stage('Set branch, PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(repoName, defraUtils.getPackageJsonVersion())
    }
    stage('Helm lint') {
      defraUtils.lintHelm(repoName)
    }
    stage('Build test image') {
      defraUtils.buildTestImage(repoName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(repoName, repoName, BUILD_NUMBER)
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
      defraUtils.buildAndPushContainerImage(regCredsId, registry, repoName, containerTag)
    }
    if (pr != '') {
      stage('Verify version incremented') {
        defraUtils.verifyPackageJsonVersionIncremented()
      }
      stage('Helm install') {
        withCredentials([
          string(credentialsId: 'sqsQueueEndpoint', variable: 'sqsQueueEndpoint'),
          string(credentialsId: 'calculationQueueUrlPR', variable: 'calculationQueueUrl'),
          string(credentialsId: 'calculationQueueAccessKeyIdSend', variable: 'calculationQueueAccessKeyId'),
          string(credentialsId: 'calculationQueueSecretAccessKeySend', variable: 'calculationQueueSecretAccessKey'),
          string(credentialsId: 'scheduleQueueUrlPR', variable: 'scheduleQueueUrl'),
          string(credentialsId: 'scheduleQueueAccessKeyIdSend', variable: 'scheduleQueueAccessKeyId'),
          string(credentialsId: 'scheduleQueueSecretAccessKeySend', variable: 'scheduleQueueSecretAccessKey'),
          string(credentialsId: 'postgresExternalNameClaimsPR', variable: 'postgresExternalName'),
          usernamePassword(credentialsId: 'postgresClaimsPR', usernameVariable: 'postgresUsername', passwordVariable: 'postgresPassword'),
          ]) {

          def helmValues = [
            /container.calculationQueueEndpoint="$sqsQueueEndpoint"/,
            /container.calculationQueueUrl="$calculationQueueUrl"/,
            /container.calculationQueueAccessKeyId="$calculationQueueAccessKeyId"/,
            /container.calculationQueueSecretAccessKey="$calculationQueueSecretAccessKey"/,
            /container.calculationCreateQueue="false"/,
            /container.scheduleQueueEndpoint="$sqsQueueEndPoint"/,
            /container.scheduleQueueUrl="$scheduleQueueUrl"/,
            /container.scheduleQueueAccessKeyId="$scheduleQueueAccessKeyId"/,
            /container.scheduleQueueSecretAccessKey="$scheduleQueueSecretAccessKey"/,
            /container.scheduleCreateQueue="false"/,
            /container.redeployOnChange="$pr-$BUILD_NUMBER"/,
            /postgresExternalName="$postgresExternalName"/,
            /postgresPassword="$postgresPassword"/,
            /postgresUsername="$postgresUsername"/,
            
          ].join(',')

          def extraCommands = [
            "--values ./helm/ffc-demo-claim-service/jenkins-aws.yaml",
            "--set $helmValues"
          ].join(' ')

          defraUtils.deployChart(kubeCredsId, registry, repoName, containerTag, extraCommands)
        }
      }
    }
    if (pr == '') {
      stage('Publish chart') {
        defraUtils.publishChart(registry, repoName, containerTag)
      }
      stage('Trigger GitHub release') {
        withCredentials([
          string(credentialsId: 'github_ffc_platform_repo', variable: 'gitToken') 
        ]) {
          defraUtils.triggerRelease(containerTag, repoName, containerTag, gitToken)
        }
      stage('Trigger Deployment') {
        withCredentials([
          string(credentialsId: 'JenkinsDeployUrl', variable: 'jenkinsDeployUrl'),
          string(credentialsId: 'ffc-demo-claim-service-deploy-token', variable: 'jenkinsToken')
        ]) {
          defraUtils.triggerDeploy(jenkinsDeployUrl, 'ffc-demo-claim-service-deploy', jenkinsToken, ['chartVersion': containerTag])
        }
      }
    }
    if (mergedPrNo != '') {
      stage('Remove merged PR') {
        defraUtils.undeployChart(kubeCredsId, repoName, mergedPrNo)
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
    defraUtils.deleteTestOutput(repoName)
  }
}
