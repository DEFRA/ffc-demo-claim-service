@Library('defra-library@psd-656-grouped-steps') _

def validateClosure = {
  echo "HERE 3"
  echo "$pr"
  echo "HERE 4"
  // stage('Validate Closure') {
  //   echo 'IN VALIDATE CLOSURE'
  //   echo "$repoName"
  //   echo "$pr"
  // }
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

buildNodeJs environment: 'dev', {
  echo "IN BODY CLOSURE"
  echo "$test2"
  echo "$test3"
  echo "$test4"
  echo "EXITING BODY CLOSURE"
}

            // validateClosure: validateClosure,
            // buildClosure: buildClosure,
            // deployClosure: deployClosure
