import path from "node:path";
import type { TeamMemberPhoto } from "@/lib/data/team-members";

export const TEAM_PHOTO_BASE_DIR = path.resolve(
  process.cwd(),
  "public/team-photos",
);

const TEAM_PHOTO_FILENAME_PATTERN = /^[a-z0-9-]+\.(png|jpe?g|webp)$/;

export function isTeamMemberPhotoFilename(
  photo: string,
): photo is TeamMemberPhoto {
  return TEAM_PHOTO_FILENAME_PATTERN.test(photo);
}

export function resolveTeamPhotoPath(photo: string): string | null {
  if (!isTeamMemberPhotoFilename(photo)) return null;

  const resolved = path.resolve(TEAM_PHOTO_BASE_DIR, photo);
  if (!resolved.startsWith(`${TEAM_PHOTO_BASE_DIR}${path.sep}`)) {
    return null;
  }

  return resolved;
}

export function getTeamPhotoMimeType(
  photo: TeamMemberPhoto,
): "image/jpeg" | "image/png" | "image/webp" {
  if (photo.endsWith(".jpg") || photo.endsWith(".jpeg")) {
    return "image/jpeg";
  }
  if (photo.endsWith(".webp")) {
    return "image/webp";
  }
  return "image/png";
}
