import { getGlobalTag, getIdTag, getUserTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export function getUserCoursesAccessGlobalTag() {
  return getGlobalTag("userCourseAccess");
}

export function getUserCourseAcessIdTag({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  return getIdTag("userCourseAccess", `course:${courseId}-user:${userId}`);
}

export function getUserCourseAccessTag(userId: string) {
  return getUserTag("userCourseAccess", userId);
}

export function revalidateUserCourseAccessCache({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  revalidateTag(getUserCoursesAccessGlobalTag());
  revalidateTag(getUserCourseAcessIdTag({ courseId, userId }));
  revalidateTag(userId);
}
