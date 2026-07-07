import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  TEAM_PHOTO_BASE_DIR,
  getTeamPhotoMimeType,
  isTeamMemberPhotoFilename,
  resolveTeamPhotoPath,
} from "../team-photos";

describe("team-photos", () => {
  it("accepts safe team photo filenames", () => {
    expect(isTeamMemberPhotoFilename("victoria-alsina.png")).toBe(true);
    expect(isTeamMemberPhotoFilename("genis-roca.jpg")).toBe(true);
    expect(isTeamMemberPhotoFilename("portrait.webp")).toBe(true);
  });

  it("rejects unsafe team photo filenames", () => {
    expect(isTeamMemberPhotoFilename("../secret.png")).toBe(false);
    expect(isTeamMemberPhotoFilename("photos/victoria-alsina.png")).toBe(false);
    expect(isTeamMemberPhotoFilename("victoria-alsina")).toBe(false);
    expect(isTeamMemberPhotoFilename("photo.PNG")).toBe(false);
    expect(isTeamMemberPhotoFilename("Victoria-Alsina.png")).toBe(false);
    expect(isTeamMemberPhotoFilename("photo.png.jpg")).toBe(false);
  });

  it("resolves valid team photos inside the public directory", () => {
    expect(resolveTeamPhotoPath("victoria-alsina.png")).toBe(
      path.resolve(TEAM_PHOTO_BASE_DIR, "victoria-alsina.png"),
    );
  });

  it("rejects traversal attempts", () => {
    expect(resolveTeamPhotoPath("../../next.config.ts")).toBeNull();
    expect(resolveTeamPhotoPath("../fonts/Outfit-Bold.ttf")).toBeNull();
  });

  it("derives the correct mime type", () => {
    expect(getTeamPhotoMimeType("victoria-alsina.png")).toBe("image/png");
    expect(getTeamPhotoMimeType("genis-roca.jpg")).toBe("image/jpeg");
    expect(getTeamPhotoMimeType("portrait.webp")).toBe("image/webp");
  });
});
