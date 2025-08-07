import React, { Suspense, useContext, useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import localFont from "@next/font/local";


// const spaceAge = localFont({
//   src: [
//     {
//       path: "../public/fonts/space-age.ttf",
//       weight: "400",
//     },
//   ],
//   variable: "--font-space-age",
// });

export default function Overview({ assets }) {
  async function handleSignIn() {
    const result = await signIn("cognito", { callbackUrl: "/overview" });
  }

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-gradient-to-bl from-secondary via-secondary to-[rgb(140,55,46)]">
      <div className="flex flex-row">
        <div className="animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite] hover:animate-none justify-center w-[18.75rem] h-[6.25rem] lg:w-[43.75rem] lg:h-[9.375rem] relative">
          <Image
            src={"https://hyperionhelios.s3.us-east-2.amazonaws.com/global_static_images/helios-logo.png"}
            fill={true}
            alt={""}
            objectFit={"contain"}
          />
        </div>
      </div>

      <button
        className={`transition ease-in-out bg-primary hover:bg-secondary hover:scale-110 duration-200 hover:text-primary ring-4 ring-offset-1 ring-secondary text-secondary hover:font-bold py-2 px-4 w-40 rounded login-button`}
        onClick={() => signIn("cognito", { callbackUrl: "/overview" })}
      >
        Sign in
      </button>
    </div>
  );
}
