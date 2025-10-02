import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get member profile
  const { data: member } = await supabase
    .from('members')
    .select('*')
    .eq('user_id', user.id)
    .single()

  // Get tickets stats
  const { count: ticketsCount } = await supabase
    .from('tickets')
    .select('*', { count: 'exact', head: true })
    .eq('member_id', member?.id || '')

  // Get recent tickets
  const { data: recentTickets } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your tickets
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">{ticketsCount || 0}</p>
              <p className="text-sm text-muted-foreground">My Tickets</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold capitalize">{member?.membership_tier || 'Basic'}</p>
              <p className="text-sm text-muted-foreground">Membership</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold capitalize">{member?.status || 'Active'}</p>
              <p className="text-sm text-muted-foreground">Account Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/tickets?action=new"
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Post a Ticket</p>
              <p className="text-sm text-muted-foreground">Share tickets you can&apos;t use</p>
            </div>
          </Link>

          <Link
            href="/dashboard/tickets"
            className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
          >
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold">Browse Tickets</p>
              <p className="text-sm text-muted-foreground">Find tickets from members</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
        {recentTickets && recentTickets.length > 0 ? (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="divide-y divide-border">
              {recentTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{ticket.event_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(ticket.event_date).toLocaleDateString()} · {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      ticket.intent === 'swap'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {ticket.intent}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground mb-4">No tickets posted yet</p>
            <Link
              href="/dashboard/tickets"
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Post Your First Ticket
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
