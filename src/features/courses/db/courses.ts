import { db } from "@/drizzle/db";
import { CourseTable } from "@/drizzle/schema";
import { revalidateCourseCache } from "./cache/courses";
import { eq } from "drizzle-orm";

export async function insertCourse(data: typeof CourseTable.$inferInsert) {
  const [newCourse] = await db.insert(CourseTable).values(data).returning();

  if (newCourse === null) throw Error("Failed to create course");

  revalidateCourseCache(newCourse?.id as string);

  return newCourse;
}
export async function updateCourse(
  id: string,
  data: typeof CourseTable.$inferInsert
) {
  const [updatedCourse] = await db
    .update(CourseTable)
    .set(data)
    .where(eq(CourseTable.id, id))
    .returning();

  if (updatedCourse === null) throw Error("Failed to update course");

  revalidateCourseCache(updatedCourse?.id as string);

  return updatedCourse;
}

export async function deleteCourse(id: string) {
  const data = await db.delete(CourseTable).where(eq(CourseTable.id, id));

  const deletedCourse = data[0];

  if (deletedCourse === null) throw Error("Failed to delete course");

  revalidateCourseCache(deletedCourse?.id as string);

  return deletedCourse;
}
