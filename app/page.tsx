import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      {/* <Hero /> */}
      <main className="">
        {/* <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />} */}

        <div className="flex justify-center items-center bg-[#23532A] bg-opacity-[.95]">
          <div className="w-full max-w-2xl px-4 py-8">
            <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
              The fastest way to build apps with{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>{" "}
              and{" "}
              <a
                href="https://nextjs.org/"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Next.js
              </a>
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center min-h-screen bg-[#F1F3E7]">
          <div className="w-full max-w-2xl px-4 py-8">
            <h1 className="sr-only">Supabase and Next.js Starter Template</h1>
            <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center">
              The fastest way to build apps with{" "}
              <a
                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Supabase
              </a>{" "}
              and{" "}
              <a
                href="https://nextjs.org/"
                target="_blank"
                className="font-bold hover:underline"
                rel="noreferrer"
              >
                Next.js
              </a>
            </p>
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
          </div>
        </div>
      </main>
    </>
  );
}
