function createMessage (claim) {
  return {
    body: claim,
    type: 'uk.gov.demo.claim.validated',
    source: 'ffc-demo-claim-service'
  }
}

module.exports = createMessage
