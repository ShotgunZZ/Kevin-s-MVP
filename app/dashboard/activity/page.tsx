'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ActivityLog {
  id: string
  member_id: string
  ticket_id: string | null
  action_type: string
  timestamp: string
}

interface Ticket {
  id: string
  event_name: string
  event_date: string
  quantity: number
  intent: string
}

interface ActivityWithTicket extends ActivityLog {
  ticket?: Ticket
}

export default function ActivityPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityWithTicket[]>([])
  const [stats, setStats] = useState({
    totalTickets: 0,
    totalSwaps: 0,
    totalDonations: 0,
  })

  useEffect(() => {
    loadActivity()
  }, [])

  const loadActivity = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/sign-in')
        return
      }

      // Get member ID
      const { data: member } = await supabase
        .from('members')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (member) {
        // Get activity logs
        const { data: activityData, error: activityError } = await supabase
          .from('activity_log')
          .select('*')
          .eq('member_id', member.id)
          .order('timestamp', { ascending: false })
          .limit(50)

        if (activityError) throw activityError

        // Get tickets for stats
        const { data: ticketsData } = await supabase
          .from('tickets')
          .select('*')
          .eq('member_id', member.id)

        // Calculate stats
        const totalTickets = ticketsData?.length || 0
        const totalSwaps = ticketsData?.filter(t => t.intent === 'swap').length || 0
        const totalDonations = ticketsData?.filter(t => t.intent === 'donate').length || 0

        setStats({
          totalTickets,
          totalSwaps,
          totalDonations,
        })

        // Fetch ticket details for each activity
        const activitiesWithTickets: ActivityWithTicket[] = []
        for (const activity of activityData || []) {
          if (activity.ticket_id) {
            const { data: ticketData } = await supabase
              .from('tickets')
              .select('id, event_name, event_date, quantity, intent')
              .eq('id', activity.ticket_id)
              .single()

            activitiesWithTickets.push({
              ...activity,
              ticket: ticketData || undefined,
            })
          } else {
            activitiesWithTickets.push(activity)
          }
        }

        setActivities(activitiesWithTickets)
      }
    } catch (err: any) {
      console.error('Error loading activity:', err)
    } finally {
      setLoading(false)
    }
  }

  const getActionIcon = (actionType: string) => {
    switch (actionType.toLowerCase()) {
      case 'created':
      case 'posted':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        )
      case 'updated':
      case 'edited':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        )
      case 'deleted':
      case 'cancelled':
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading activity...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Activity</h1>
        <p className="text-muted-foreground">Track your ticket postings and activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalTickets}</p>
              <p className="text-sm text-muted-foreground">Total Tickets</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalSwaps}</p>
              <p className="text-sm text-muted-foreground">Swaps</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalDonations}</p>
              <p className="text-sm text-muted-foreground">Donations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-card border border-border rounded-lg">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>

        <div className="p-6">
          {activities.length > 0 ? (
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  {getActionIcon(activity.action_type)}
                  <div className="flex-1">
                    <p className="font-medium capitalize">{activity.action_type} Ticket</p>
                    {activity.ticket && (
                      <p className="text-sm text-muted-foreground">
                        {activity.ticket.event_name} · {new Date(activity.ticket.event_date).toLocaleDateString()}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-muted-foreground mb-4">No activity yet</p>
              <p className="text-sm text-muted-foreground">
                Start posting tickets to see your activity here
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
