import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import Link from "next/link";
import { CourseTable } from "@/features/courses/components/CourseTable";
import { getCourseGlobalTag } from "@/features/courses/db/cache/courses";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { db } from "@/drizzle/db";
import {
  CourseSectionTable,
  CourseTable as DbCourseTable,
  LessonTable,
  UserCourseAccessTable,
} from "@/drizzle/schema";
import { asc, countDistinct, eq } from "drizzle-orm";
import { getUserCoursesAccessGlobalTag } from "@/features/courses/db/cache/userCourseAccess";
import { getCourseSectionGlobalTag } from "@/features/courseSections/db/cache/cache";
import { getLessonGlobalTag } from "@/features/lessons/db/cache/cache";
import { Suspense } from "react";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="mx-auto container my-6">
        <PageHeader className="justify-between" title="TITLE">
          <Button asChild>
            <Link href={"/admin/courses/new"}> New Course</Link>
          </Button>
        </PageHeader>
        <CourseTable courses={courses} />
    </div>
  );
}

async function getCourses() {
  "use cache";

  cacheTag(
    getCourseGlobalTag(),
    getUserCoursesAccessGlobalTag(),
    getCourseSectionGlobalTag(),
    getLessonGlobalTag()
  );

  return db
    .select({
      id: DbCourseTable.id,
      name: DbCourseTable.name,
      sectionsCount: countDistinct(CourseSectionTable),
      lessonsCount: countDistinct(LessonTable),
      studentsCount: countDistinct(UserCourseAccessTable),
    })
    .from(DbCourseTable)
    .leftJoin(
      CourseSectionTable,
      eq(CourseSectionTable.courseId, DbCourseTable.id)
    )
    .leftJoin(LessonTable, eq(LessonTable.sectionId, CourseSectionTable.id))
    .leftJoin(
      UserCourseAccessTable,
      eq(UserCourseAccessTable.courseId, DbCourseTable.id)
    )
    .orderBy(asc(DbCourseTable.name))
    .groupBy(DbCourseTable.id);
}
