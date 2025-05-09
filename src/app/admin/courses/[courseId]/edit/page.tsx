import { ActionButton } from "@/components/ActionButton";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/drizzle/db";
import { CourseSectionTable, CourseTable, LessonTable } from "@/drizzle/schema";
import { CourseForm } from "@/features/courses/components/CourseForm";
import { getCourseIdTag } from "@/features/courses/db/cache/courses";
import { deleteSection } from "@/features/courseSections/actions/sections";
import { SectionFormDialog } from "@/features/courseSections/components/SectionFormDialog";
import { SortableSectionList } from "@/features/courseSections/components/SortableSectionList";
import {
  getCourseSectionGlobalTag,
  getCourseSectionIdTag,
} from "@/features/courseSections/db/cache/cache";
import { LessonFormDialog } from "@/features/lessons/components/LessonFormDialog";
import { SortableLessonList } from "@/features/lessons/components/SortableLessonList";
import { getLessonCourseTag } from "@/features/lessons/db/cache/cache";
import { cn } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import { EyeClosedIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function EditCoursePagew({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  const course = await getCourse(courseId);

  if (!course) return notFound();

  console.log("course", course);

  return (
    <div className="m-auto container my-6">
      <PageHeader title={course.name} />

      <Tabs defaultValue="lessons">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex items-center flex-row justify-between">
              <CardTitle>Sections</CardTitle>

              <SectionFormDialog courseId={courseId}>
                <DialogTrigger asChild>
                  <Button variant={"outline"}>
                    <PlusIcon /> New Section
                  </Button>
                </DialogTrigger>
              </SectionFormDialog>
            </CardHeader>
            <CardContent>
              <SortableSectionList
                sections={course.courseSections}
                courseId={course.id}
              />
            </CardContent>
          </Card>
          <hr className="my-2" />

          {course.courseSections.map((section) => {
            return (
              <Card key={section.id}>
                <CardHeader className="flex items-center flex-row justify-between gap-4">
                  <CardTitle
                    className={cn(
                      "flex items-center gap-2",
                      section.status === "private" && "text-muted-foreground"
                    )}
                  >
                    {section.status === "private" && <EyeClosedIcon />}
                    {section.name}
                  </CardTitle>

                  <LessonFormDialog
                    defaultSectionId={section.id}
                    sections={course.courseSections}
                  >
                    <DialogTrigger asChild>
                      <Button variant={"outline"}>
                        <PlusIcon /> New Lesson
                      </Button>
                    </DialogTrigger>
                  </LessonFormDialog>
                </CardHeader>
                <CardContent>
                  <SortableLessonList
                    //@ts-ignore
                    lessons={section.lessons}
                    sections={course.courseSections}
                  />
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CourseForm course={course} />
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

async function getCourse(id: string) {
  "use cache";

  cacheTag(
    getCourseIdTag(id),
    getCourseSectionIdTag(id),
    getLessonCourseTag(id),
    getCourseSectionGlobalTag()
  );

  return db.query.CourseTable.findFirst({
    columns: { id: true, name: true, description: true },
    where: eq(CourseTable.id, id),
    with: {
      courseSections: {
        orderBy: asc(CourseSectionTable.order),
        columns: { id: true, name: true, status: true },
        with: {
          lessons: {
            orderBy: asc(LessonTable.order),
            columns: {
              id: true,
              name: true,
              status: true,
              description: true,
              youtubeVideoId: true,
              sectionId: true,
            },
          },
        },
      },
    },
  });
}
