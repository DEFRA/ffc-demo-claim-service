const index = require("../../../app/notify/index");

jest.mock("notifications-node-client");
const { NotifyClient } = require("notifications-node-client");

NotifyClient.mockImplementation(() => {
  return {
    sendEmail: jest.fn(),
  };
});

jest.mock("../../../app/config", () => {
  return {
    env: "test",
    publishPollingInterval: 5000,
    notifyApiKey: "test",
    notifyEmailTemplateKey: "test",
  };
});
const config = require("../../../app/config");

jest.mock("util");
const util = require("util");

describe("index", () => {
  let notifyClient;
  beforeEach(() => {
    jest.clearAllMocks();
    notifyClient = new NotifyClient();
    NotifyClient.mockImplementation(() => notifyClient);
  });

  it("should send email notification", async () => {
    const claim = {
      claimId: "claim101",
      name: "mine123",
      propertyType: "home",
      dateOfSubsidence: Date.now(),
      accessible: true,
      email: "admin@admin.com",
      mineType: ["coal", "gold"],
    };
    await index.sendEmailNotification(claim);
    expect(notifyClient.sendEmail).toHaveBeenCalled();
  });

  it("should send email notification", async () => {
    notifyClient.sendEmail.mockImplementationOnce(() => {
      throw new Error("Error sending email");
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
    await index.sendEmailNotification(claim);
  });
});
