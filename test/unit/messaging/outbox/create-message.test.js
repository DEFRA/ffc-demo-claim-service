const createMessage = require("../../../../app/messaging/outbox/create-message");

describe("createMessage", () => {
  it("should create a message", () => {
    const claim = {
      claimId: "claim101",
      name: "mine123",
      propertyType: "home",
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: "admin@admin.com",
      mineType: ["coal", "gold"],
    };
    expect(createMessage(claim)).toMatchObject({
      body: claim,
      type: "uk.gov.demo.claim.validated",
      source: "ffc-demo-claim-service",
    });
  });
});
