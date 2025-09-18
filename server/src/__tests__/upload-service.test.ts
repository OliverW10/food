import { PassThrough } from "stream";
import { saveUploadedImage } from "../service/upload-service";

jest.mock("../db", () => {
  return {
    db: {
      image: {
        create: jest
          .fn()
          .mockResolvedValue({ id: 123, storageUrl: "/uploads/guid-file.png" }),
      },
    },
  };
});

import { db } from "../db";

describe("upload-service", () => {
  it("saves uploaded image metadata", async () => {
    const fakeFile: Express.Multer.File = {
      /** required by interface */
      fieldname: "image",
      originalname: "original.png",
      encoding: "7bit",
      mimetype: "image/png",
      size: 2048,
      destination: "uploads",
      filename: "file.png",
      path: "uploads/file.png",
      buffer: Buffer.from([]),
      stream: new PassThrough(),
    };
    const result = await saveUploadedImage({ file: fakeFile });
    expect(db.image.create).toHaveBeenCalledWith({
      data: { storageUrl: expect.stringMatching(/^\/uploads\//) },
    });
    expect(result).toEqual({ id: 123, storageUrl: "/uploads/guid-file.png" });
  });

  it("throws when file missing", async () => {
    // @ts-expect-error testing runtime path
    await expect(saveUploadedImage({})).rejects.toThrow("File is required");
  });
});
