import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">404</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">This page could not be found.</p>
      <div className="mt-6 flex items-center justify-center gap-4">
        <Link href="/" className="rounded-full bg-black px-5 py-2 text-white dark:bg-zinc-50 dark:text-black">
          Home
        </Link>
        <Link href="/events" className="rounded-full border border-zinc-300 px-5 py-2 text-zinc-900 dark:border-zinc-700 dark:text-zinc-50">
          Explore Events
        </Link>
      </div>
    </div>
  );
}