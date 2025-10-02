import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members Portal | Share Tickets, Build Community',
  description: 'Secure members-only portal for sharing tickets with fellow club members. Swap or donate tickets you can\'t use and never miss a game.',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
              Share Tickets. Build Community.
              <br />
              <span className="text-primary">Make Every Game Count.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A members-only portal where you can share tickets you can't use,
              help fellow members attend events, and strengthen our community.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Join as a Member
              </Link>
              <Link
                href="/sign-in"
                className="px-8 py-4 border-2 border-border rounded-lg font-semibold text-lg hover:bg-accent transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Join Our Portal?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built exclusively for members, by members
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Share or Donate Tickets</h3>
              <p className="text-muted-foreground">
                Can't make it to a game? Post your tickets for swap or donation. Help a fellow member attend instead of letting seats go empty.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Members-Only Community</h3>
              <p className="text-muted-foreground">
                Secure, verified member access only. Connect with fellow fans and build relationships within our trusted community.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Activity</h3>
              <p className="text-muted-foreground">
                View your ticket posting history, track swaps and donations, and see your contributions to the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">
              Simple, secure, and built for members
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Join as a Member</h3>
              <p className="text-sm text-muted-foreground">
                Sign up with your email and create your secure member profile
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Post Your Tickets</h3>
              <p className="text-sm text-muted-foreground">
                Add event details and choose to swap or donate your tickets
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Connect With Members</h3>
              <p className="text-sm text-muted-foreground">
                Browse available tickets and coordinate with fellow members
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Enjoy the Game</h3>
              <p className="text-sm text-muted-foreground">
                Make sure every seat is filled and every member can participate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start sharing tickets and connecting with fellow members today
          </p>
          <Link
            href="/sign-up"
            className="inline-block px-8 py-4 bg-primary-foreground text-primary rounded-lg font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg"
          >
            Create Your Member Account
          </Link>
          <p className="mt-6 text-sm opacity-75">
            Already a member?{' '}
            <Link href="/sign-in" className="underline font-semibold">
              Sign in here
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-muted-foreground">
            <p className="mb-2">© 2025 Members Portal. All rights reserved.</p>
            <p className="text-sm">
              Built for the community, by the community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
