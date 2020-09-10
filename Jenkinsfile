@Library('defra-library@psd-953-helm-deploy') _

/* buildNodeJs environment: 'dev' */
node {
  def containerSrcFolder = '/home/node'
  def nodeDevelopmentImage = 'defradigital/node-development'

  try {
    stage('Checkout source code') {
      build.checkoutSourceCode()
    }

    stage('Set PR, and tag variables') {
      (repoName, pr, tag, mergedPrNo) = build.getVariables(version.getPackageJsonVersion())
    }

    stage('Helm lint') {
      test.lintHelm(repoName)
    }

    stage('Build test image') {
      build.buildTestImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, BUILD_NUMBER, tag)
    }

    stage('Provision resources') {
      provision.createResources('dev', repoName, pr)
    }

    stage('Build & push container image') {
      build.buildAndPushContainerImage(DOCKER_REGISTRY_CREDENTIALS_ID, DOCKER_REGISTRY, repoName, tag)
    }

    if (pr != '') {
      stage('Helm install') {
        helm.deployChart('dev', DOCKER_REGISTRY, repoName, tag)
      }
    } else {
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
          deploy.trigger(JENKINS_DEPLOY_SITE_ROOT, repoName, jenkinsToken, ['chartVersion': tag, 'environment': 'dev', 'helmChartRepoType': HELM_CHART_REPO_TYPE])
        }
      }
    }

    stage('Run Acceptance Tests') {
      test.runAcceptanceTests(pr)
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

    stage('Clean up resources') {
      provision.deleteBuildResources(repoName, pr)
    }
  }
}
