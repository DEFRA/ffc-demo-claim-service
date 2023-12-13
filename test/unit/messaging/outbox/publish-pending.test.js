const publishPendingClaims = require("../../../../app/messaging/outbox/publish-pending");

jest.mock("../../../../app/messaging/outbox/create-message", () => {
  return jest.fn();
});
const createMessage = require("../../../../app/messaging/outbox/create-message");

jest.mock("../../../../app/messaging/outbox/update-published", () => {
  return jest.fn();
});
const updatePublished = require("../../../../app/messaging/outbox/update-published");

jest.mock("../../../../app/messaging/outbox/get-pending-claims", () => {
  return jest.fn().mockReturnValue([
    {
      claimId: "claim101",
      name: "mine123",
      propertyType: "home",
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: "admin@admin.com",
      mineType: ["coal", "gold"],
    },
    {
      claimId: "claim102",
      name: "mine123",
      propertyType: "home",
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: "admin@admin.com",
      mineType: ["coal", "gold"],
    },
  ]);
});
const getPendingClaims = require("../../../../app/messaging/outbox/get-pending-claims");

jest.mock("../../../../app/notify", () => {
  return {
    sendEmailNotification: jest.fn(),
  };
});
const { sendEmailNotification } = require("../../../../app/notify");

jest.mock("adp-messaging");
const { MessageSender } = require("adp-messaging");
MessageSender.mockImplementation(() => {
  return {
    sendMessage: jest.fn(),
  };
});

describe("publishPendingClaims", () => {
  let sender;
  beforeEach(() => {
    jest.clearAllMocks();
    sender = new MessageSender();
    MessageSender.mockImplementation(() => sender);
  });

  it("should call publish pending claims", async () => {
    await publishPendingClaims(sender, sender);
    expect(getPendingClaims).toHaveBeenCalled();
    expect(createMessage).toHaveBeenCalled();
    expect(sender.sendMessage).toHaveBeenCalled();
    expect(sendEmailNotification).toHaveBeenCalled();
    expect(updatePublished).toHaveBeenCalled();
  });

  it("handle error", async () => {
    createMessage.mockImplementationOnce(() => {
      throw new Error("Error creating message");
    });
    await publishPendingClaims(sender, sender);
  });
});
