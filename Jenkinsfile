@Library('defra-library@master')
import uk.gov.defra.ffc.DefraUtils
def defraUtils = new DefraUtils()

def registry = '562955126301.dkr.ecr.eu-west-2.amazonaws.com'
def regCredsId = 'ecr:eu-west-2:ecr-user'
def kubeCredsId = 'awskubeconfig002'
def imageName = 'ffc-demo-claim-service'
def repoName = 'ffc-demo-claim-service'
def pr = ''
def mergedPrNo = ''
def containerTag = ''

node {
  checkout scm
  try {
    stage('Set branch, PR, and containerTag variables') {
      (pr, containerTag, mergedPrNo) = defraUtils.getVariables(repoName)
      defraUtils.updateGithubCommitStatus('Build started', 'PENDING')
    }
    stage('Build test image') {
      defraUtils.buildTestImage(imageName, BUILD_NUMBER)
    }
    stage('Run tests') {
      defraUtils.runTests(imageName, BUILD_NUMBER)
    }
    stage('Push container image') {
      defraUtils.pushContainerImage(regCredsId, registry, imageName, containerTag)
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
          def extraCommands = "--values ./helm/ffc-demo-claim-service/jenkins-aws.yaml --set container.messageQueueHost=\"$messageQueueHost\",container.scheduleQueueUser=\"$scheduleQueueUsername\",container.scheduleQueuePassword=\"$scheduleQueuePassword\",container.calculationQueueUser=\"$calculationQueueUsername\",container.calculationQueuePassword=\"$calculationQueuePassword\",postgresExternalName=\"$postgresExternalName\",postgresUsername=\"$postgresUsername\",postgresPassword=\"$postgresPassword\""
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
    defraUtils.updateGithubCommitStatus('Build successful', 'SUCCESS')
  } catch(e) {
    defraUtils.updateGithubCommitStatus(e.message, 'FAILURE')
    throw e
  }
}

