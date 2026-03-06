import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const activeTheme = await prisma.theme.findFirst({
    where: { isActive: true },
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-background text-foreground">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          White Label Auth System &nbsp;
          <code className="font-bold">Variant 1</code>
        </p>
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-to-br before:from-transparent before:to-blue-700 before:opacity-10 before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-to-tr after:from-blue-100 after:via-blue-100 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-900 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
            {activeTheme?.name || "Default"} Theme Active
          </h1>
          <p className="text-lg leading-8 text-muted-foreground mb-8">
            Experience the customizable authentication flows.
          </p>
          <div className="flex items-center justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold leading-6 text-foreground"
            >
              Register <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left mt-20">
        {/* Feature grid */}
      </div>
    </main>
  );
}
