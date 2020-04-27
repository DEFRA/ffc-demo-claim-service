@Library('defra-library@psd-656-grouped-steps') _

def validateClosure = {
  stage('Validate Closure') {
    echo 'IN VALIDATE CLOSURE'
  }
}

def buildClosure = {
  stage('Build Closure') {
    echo 'IN BUILD CLOSURE'
  }
}

def testClosure = {
  stage('Test Closure') {
    echo 'IN TEST CLOSURE'
  }
}

def deployClosure = {
  stage('Deploy Closure') {
    echo 'IN DEPLOY CLOSURE'
  }
}

def failureClosure = {
  stage('Failure Closure') {
    echo 'IN FAILURE CLOSURE'
  }
}

def finallyClosure = {
  stage('Finally Closure') {
    echo 'IN FINALLY CLOSURE'
  }
}

buildNodeJs environment: 'dev',
            validateClosure: validateClosure,
            buildClosure: buildClosure,
            testClosure: testClosure,
            deployClosure: deployClosure,
            failureClosure: failureClosure,
            finallyClosure: finallyClosure
