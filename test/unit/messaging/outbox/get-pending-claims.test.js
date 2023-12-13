const getPendingClaims = require("../../../../app/messaging/outbox/get-pending-claims");

jest.mock("../../../../app/services/database-service", () => {
  const mockDatabaseService = {
    models: {
      outbox: {
        findAll: jest.fn(),
      },
    },
    sequelize: {
      col: jest.fn(),
    },
  };
  return () => mockDatabaseService;
});

describe("get pending claims", () => {
  let mockDatabaseService;

  beforeEach(() => {
    const databaseService = require("../../../../app/services/database-service");
    mockDatabaseService = databaseService();
    jest.clearAllMocks();
  });

  it("should return all pending claims", async () => {
    mockDatabaseService.models.outbox.findAll.mockResolvedValue([]);
    await getPendingClaims();
    expect(mockDatabaseService.models.outbox.findAll).toHaveBeenCalled();
  });
});
