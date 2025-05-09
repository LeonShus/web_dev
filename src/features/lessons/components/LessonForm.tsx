"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RequiredLabelIcon } from "@/components/RequiredLabelIcon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { toastAction } from "@/lib/utils";
import { LessonStatus, lessonStatuses } from "@/drizzle/schema";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { lessonSchema } from "../schemas/lessons";
import { Textarea } from "@/components/ui/textarea";
import { createLesson, updateLesson } from "../actions/lessons";
import { YoutubeVideoPlayer } from "./YoutubeVideoPlayer";

export function LessonForm({
  defaultSectionId,
  sections,
  onSuccess,
  lesson,
}: {
  defaultSectionId?: string;
  sections: { id: string; name: string }[];
  onSuccess?: () => void;
  lesson?: {
    id: string;
    name: string;
    status: LessonStatus;
    youtubeVideoId: string;
    description: string | null;
    sctionId: string;
  };
}) {
  const form = useForm<z.infer<typeof lessonSchema>>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.name ?? "",
      description: lesson?.description ?? "",
      //@ts-ignore
      sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "",
      status: lesson?.status ?? "public",
      youtubeVideoId: lesson?.youtubeVideoId ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof lessonSchema>) => {
    const action = lesson ? updateLesson.bind(null, lesson.id) : createLesson;
    const data = await action(values);

    toastAction({ data });

    if (!data.error) {
      onSuccess?.();
    }
  };

  const videoId = form.watch("youtubeVideoId");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col @container"
      >
        <div className="grid grid-cols-1 @lg:grid-cold-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    <RequiredLabelIcon />
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="youtubeVideoId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>
                    <RequiredLabelIcon />
                    Youtube Video Id
                  </FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="sectionId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sections.map((section) => {
                        return (
                          <SelectItem key={section.id} value={section.id}>
                            {section.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lessonStatuses.map((status) => {
                        return (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </div>
        <div className="self-end">
          <Button type="submit">Save</Button>
        </div>

        {videoId && (
          <div className="aspect-video">
            <YoutubeVideoPlayer videoId={videoId} />
          </div>
        )}
      </form>
    </Form>
  );
}
