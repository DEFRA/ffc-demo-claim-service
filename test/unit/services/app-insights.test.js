const appInsights = require("applicationinsights");
jest.mock("applicationinsights", () => ({
  setup: jest.fn().mockReturnThis(),
  setAutoCollectConsole: jest.fn().mockReturnThis(),
  setDistributedTracingMode: jest.fn().mockReturnThis(),
  start: jest.fn().mockReturnThis(),
  DistributedTracingModes: {
    AI_AND_W3C: "AI_AND_W3C",
  },
  defaultClient: {
    context: {
      keys: {
        cloudRole: "cloudRole",
      },
      tags: {},
    },
  },
}));

describe("App Insights setup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call appInsights.setup when APPINSIGHTS_INSTRUMENTATIONKEY is set", () => {
    process.env.APPINSIGHTS_INSTRUMENTATIONKEY = "test-key";
    require("../../../app/services/app-insights").setup();
    expect(appInsights.setup).toHaveBeenCalled();
  });

  it("should not call appInsights.setup when APPINSIGHTS_INSTRUMENTATIONKEY is not set", () => {
    delete process.env.APPINSIGHTS_INSTRUMENTATIONKEY;
    require("../../../app/services/app-insights").setup();
    expect(appInsights.setup).not.toHaveBeenCalled();
  });
});
