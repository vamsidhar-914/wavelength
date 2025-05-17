import { api } from "~/trpc/server";
import { WaveIcon } from "./_components/wave-icon";
import Link from "next/link";
import { Button } from "~/components/ui/button";

export default async function Home() {
  const session = false
  return (
      <div className="container max-w-4xl py-6">
         <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/">
            <WaveIcon className="h-8 w-8 text-emerald-500" />
          </Link>
          <h1 className="text-2xl font-bold">Wavelength</h1>
        </div>
        {session ? (
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button className="bg-emerald-600 hover:bg-emerald-700">New Wave</Button>
            </Link>
            <Link href={`/`}>
              <Button variant="ghost">Profile</Button>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-emerald-600 hover:bg-emerald-700">Sign up</Button>
            </Link>
          </div>
        )}
      </header>
      </div>
  );
}
