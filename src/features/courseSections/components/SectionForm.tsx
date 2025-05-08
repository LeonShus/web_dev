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
import { CourseSectionStatus, courseSectionStatuses } from "@/drizzle/schema";
import { sectionSchema } from "../schemas/courses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSection, updateSection } from "../actions/sections";

export function SectionForm({
  courseId,
  section,
  onSuccess,
}: {
  courseId: string;
  section?: { id: string; name: string; status: CourseSectionStatus } | null;
  onSuccess?: () => void;
}) {
  const form = useForm<z.infer<typeof sectionSchema>>({
    resolver: zodResolver(sectionSchema),
    defaultValues: section ?? {
      name: "",
      status: "public",
    },
  });

  const onSubmit = async (values: z.infer<typeof sectionSchema>) => {
    const action = section
      ? updateSection.bind(null, section.id)
      : createSection.bind(null, courseId);
    const data = await action(values);

    toastAction({ data });

    if(!data.error){
      onSuccess?.()
    }
  };

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
                      {courseSectionStatuses.map((status) => {
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
        </div>
        <div className="self-end">
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
