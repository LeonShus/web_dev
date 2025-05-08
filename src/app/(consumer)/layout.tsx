import { Button } from "@/components/ui/button";
import { getUserIdTag } from "@/features/users/db/cache";
import { canAccessAdminPages } from "@/permissions/general";
import { getCurrentUser } from "@/services/clerk";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { ReactNode, Suspense } from "react";

export default function ConsumerLayout({
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
        <Link
          className="mr-auto text-lg hover:underline flex items-center "
          href="/"
        >
          Web Dev
        </Link>
        <Suspense fallback={"Loading"}>
          <SignedIn>
            <AdminLink />
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/courses"
            >
              My Courses
            </Link>
            <Link
              className="hover:bg-accent/10 flex items-center px-2"
              href="/purchases"
            >
              Purchase History
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
          </SignedIn>
        </Suspense>

        <Suspense>
          <SignedOut>
            <Button className="self-center" asChild>
              <SignInButton>Sign in</SignInButton>
            </Button>
          </SignedOut>
        </Suspense>
      </nav>
    </header>
  );
}

async function AdminLink() {
  const user = await getCurrentUser();

  console.log("user", user?.user, user);

  if (!canAccessAdminPages({ role: user.role })) {
    return null;
  }

  return (
    <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
      Admin
    </Link>
  );
}
