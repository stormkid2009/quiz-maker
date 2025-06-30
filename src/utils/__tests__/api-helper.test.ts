import { getOneRandomDoc, PrismaModel } from "../api-helper";
import { z } from "zod";

// Mock console methods to avoid cluttering test output
const consoleSpy = {
  warn: jest.spyOn(console, 'warn').mockImplementation(() => {}),
  error: jest.spyOn(console, 'error').mockImplementation(() => {}),
};

const TestSchema = z.object({
  id: z.number(),
  name: z.string(),
});

type TestType = z.infer<typeof TestSchema>;

const createMockCollection = (
  data: TestType[],
  count: number
): PrismaModel<TestType> => ({
  findMany: jest.fn().mockResolvedValue(data),
  count: jest.fn().mockResolvedValue(count),
});

describe("getOneRandomDoc", () => {
  it("should return a random document from the collection", async () => {
    const mockData = [{ id: 1, name: "Test" }];
    const mockCollection = createMockCollection(mockData, 1);
    const result = await getOneRandomDoc(mockCollection, TestSchema);
    expect(result).toEqual(mockData[0]);
    expect(mockCollection.count).toHaveBeenCalledTimes(1);
    expect(mockCollection.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return null if the collection is empty", async () => {
    const mockCollection = createMockCollection([], 0);
    const result = await getOneRandomDoc(mockCollection, TestSchema);
    expect(result).toBeNull();
    expect(mockCollection.count).toHaveBeenCalledTimes(1);
    expect(mockCollection.findMany).not.toHaveBeenCalled();
  });

  it("should return null if the document fails validation", async () => {
    const invalidData = [{ id: 1, name: 123 }];
    // @ts-expect-error
    const mockCollection = createMockCollection(invalidData, 1);
    const result = await getOneRandomDoc(mockCollection, TestSchema);
    expect(result).toBeNull();
  });

  it("should return null on database error", async () => {
    const mockCollection = {
      count: jest.fn().mockRejectedValue(new Error("DB Error")),
      findMany: jest.fn(),
    };
    const result = await getOneRandomDoc(mockCollection, TestSchema);
    expect(result).toBeNull();
  });
});
