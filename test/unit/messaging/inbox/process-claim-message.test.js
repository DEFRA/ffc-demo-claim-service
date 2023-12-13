const processClaimMessage = require("../../../../app/messaging/inbox/process-claim-message");

jest.mock("../../../../app/messaging/inbox/create-claim", () => {
  return jest.fn().mockImplementation(() => {
    return {
      createClaim: jest.fn(),
    };
  });
});
const createClaim = require("../../../../app/messaging/inbox/create-claim");

jest.mock("adp-messaging", () => {
  return {
    MessageReceiver: jest.fn().mockImplementation(() => {
      return {
        completeMessage: jest.fn(),
        abandonMessage: jest.fn(),
      };
    }),
  };
});
const adpMessaging = require("adp-messaging");

describe("process claim message", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should process claim message if no error", async () => {
    const claim = {
      claimId: "claim101",
      name: "mine123",
      propertyType: "home",
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: "admin@admin.com",
      mineType: ["coal", "gold"],
    };
    let claimReceiver = new adpMessaging.MessageReceiver();
    await processClaimMessage(claim, claimReceiver);
    expect(createClaim).toHaveBeenCalled();
    expect(claimReceiver.completeMessage).toHaveBeenCalled();
  });

  it("should not process claim message if error", async () => {
    createClaim.mockImplementationOnce(() => {
      throw new Error("Error creating claim");
    });
    const claim = {
      claimId: "claim101",
      name: "mine123",
      propertyType: "home",
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: "admin@admin.com",
      mineType: ["coal", "gold"],
    };
    let claimReceiver = new adpMessaging.MessageReceiver();
    await processClaimMessage(claim, claimReceiver);
    expect(createClaim).toHaveBeenCalled();
    expect(claimReceiver.abandonMessage).toHaveBeenCalled();
  });
});
