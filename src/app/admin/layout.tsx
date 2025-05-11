import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUserIdTag } from "@/features/users/db/cache";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { ReactNode, Suspense } from "react";

export default function AdminLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <Navbar />

      {children}
    </>
  );
}

function Navbar() {
  return (
    <header className="flex h-12 shadow bg-background z-10">
      <nav className="flex gap-4 justify-between w-full px-5">
        <div className="mr-auto hover:underline px-2 flex items-center gap-2 ">
          <Link className="mr-auto text-lg hover:underline" href="/">
            Web Dev
          </Link>
          <Badge>Admin</Badge>
        </div>
        <Suspense fallback={"Loading"}>
          <SignedIn>
            <div className="flex gap-4 ">
              <AdminLink />
              <Link
                className="hover:bg-accent/10 flex items-center px-2"
                href="/admin/courses"
              >
                Courses
              </Link>
              <Link
                className="hover:bg-accent/10 flex items-center px-2"
                href="/admin/products"
              >
                Products
              </Link>
              <Link
                className="hover:bg-accent/10 flex items-center px-2"
                href="/admin/sales"
              >
                Sales
              </Link>
              <div className="size-8 self-center">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: { width: "100%", height: "100%" },
                    },
                  }}
                />
              </div>
            </div>
          </SignedIn>
        </Suspense>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const user = await getCurrentUser();

  if (!canAccessAdminPages({ role: user.role })) {
    return null;
  }

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  );
}
