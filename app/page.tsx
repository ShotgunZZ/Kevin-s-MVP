export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-5xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">
          Members-Only Ticket Portal
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Share tickets. Build community. Make every game count.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/sign-up"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
          >
            Join Now
          </a>
          <a
            href="/sign-in"
            className="px-6 py-3 border border-border rounded-md font-medium hover:bg-accent transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}
