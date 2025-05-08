"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseSectionStatus } from "@/drizzle/schema";
import { ReactNode, useState } from "react";
import { SectionForm } from "./SectionForm";

export const SectionFormDialog = ({
  courseId,
  children,
  section = null,
}: {
  courseId: string;
  children: ReactNode;
  section?: { id: string; name: string; status: CourseSectionStatus } | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {Boolean(!section) && "New Section"}
            {section && `Edit ${section.name}`}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <SectionForm
            section={section}
            courseId={courseId}
            onSuccess={() => {
              setIsOpen(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
