import React, { useEffect } from "react";
import { useRouter } from "next/router";
/*-----------------Login ------------------- */
import { useSession } from "next-auth/react";
import MessageScreen from "../layout/message_screen";

export default function AuthCheck({ children }: { children: JSX.Element }) {
  const { data: session } = useSession();
  const router = useRouter();

  return session ? <>{children}</> : null;
}
