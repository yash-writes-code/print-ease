"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div>
      {session ? (
        <div className="flex space-x-2">
          <Image
            src={session.user?.image || "/default-image.png"}
            width={30}
            height={30}
            alt="Name"
            className="rounded-full"
          ></Image>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <button onClick={() => signIn("google")}>Sign In with Google</button>
      )}
    </div>
  );
}
