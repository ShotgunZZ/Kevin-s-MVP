'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

interface Ticket {
  id: string
  member_id: string
  event_name: string
  event_date: string
  quantity: number
  intent: 'swap' | 'donate'
  status: string
  created_at: string
}

export default function TicketsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [myTickets, setMyTickets] = useState<Ticket[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [filter, setFilter] = useState<'all' | 'swap' | 'donate'>('all')
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null)

  // Form state
  const [eventName, setEventName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [intent, setIntent] = useState<'swap' | 'donate'>('swap')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadTickets = useCallback(async () => {
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
        setCurrentMemberId(member.id)

        // Get all tickets
        const { data: allTickets, error: ticketsError } = await supabase
          .from('tickets')
          .select('*')
          .order('created_at', { ascending: false })

        if (ticketsError) throw ticketsError

        // Separate my tickets from others
        const mine = allTickets?.filter(t => t.member_id === member.id) || []
        const others = allTickets?.filter(t => t.member_id !== member.id) || []

        setMyTickets(mine)
        setTickets(others)
      }
    } catch (err: unknown) {
      console.error('Error loading tickets:', err)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadTickets()
    if (searchParams.get('action') === 'new') {
      setShowModal(true)
    }
  }, [loadTickets, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const supabase = createClient()

      if (!currentMemberId) throw new Error('Member ID not found')

      if (editingTicket) {
        // Update existing ticket
        const { error } = await supabase
          .from('tickets')
          .update({
            event_name: eventName,
            event_date: eventDate,
            quantity,
            intent,
          })
          .eq('id', editingTicket.id)

        if (error) throw error
      } else {
        // Create new ticket
        const { error } = await supabase
          .from('tickets')
          .insert({
            member_id: currentMemberId,
            event_name: eventName,
            event_date: eventDate,
            quantity,
            intent,
            status: 'available',
          })

        if (error) throw error
      }

      // Reset form and reload
      resetForm()
      setShowModal(false)
      loadTickets()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setEventName(ticket.event_name)
    setEventDate(ticket.event_date)
    setQuantity(ticket.quantity)
    setIntent(ticket.intent)
    setShowModal(true)
  }

  const handleDelete = async (ticketId: string) => {
    if (!confirm('Are you sure you want to delete this ticket?')) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId)

      if (error) throw error
      loadTickets()
    } catch (err: unknown) {
      alert('Error deleting ticket: ' + (err instanceof Error ? err.message : 'An error occurred'))
    }
  }

  const resetForm = () => {
    setEditingTicket(null)
    setEventName('')
    setEventDate('')
    setQuantity(1)
    setIntent('swap')
    setFormError(null)
  }

  const filteredTickets = tickets.filter(t => filter === 'all' || t.intent === filter)
  const filteredMyTickets = myTickets.filter(t => filter === 'all' || t.intent === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tickets...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tickets</h1>
          <p className="text-muted-foreground">Browse and manage ticket postings</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity"
        >
          + Post Ticket
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:bg-accent'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('swap')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'swap'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:bg-accent'
          }`}
        >
          Swap
        </button>
        <button
          onClick={() => setFilter('donate')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            filter === 'donate'
              ? 'bg-primary text-primary-foreground'
              : 'bg-card border border-border hover:bg-accent'
          }`}
        >
          Donate
        </button>
      </div>

      {/* My Tickets */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
        {filteredMyTickets.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredMyTickets.map((ticket) => (
              <div key={ticket.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{ticket.event_name}</h3>
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
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(ticket)}
                    className="flex-1 px-3 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="flex-1 px-3 py-2 text-sm border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">You haven&apos;t posted any tickets yet</p>
          </div>
        )}
      </div>

      {/* Available Tickets */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available from Members</h2>
        {filteredTickets.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map((ticket) => (
              <div key={ticket.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold">{ticket.event_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ticket.event_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.quantity} {ticket.quantity === 1 ? 'ticket' : 'tickets'}
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
        ) : (
          <div className="bg-card border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground">No tickets available at the moment</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingTicket ? 'Edit Ticket' : 'Post a Ticket'}
            </h2>

            {formError && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/50 rounded-md">
                <p className="text-sm text-destructive">{formError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  placeholder="e.g. Lakers vs Warriors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Number of Tickets</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Intent</label>
                <select
                  value={intent}
                  onChange={(e) => setIntent(e.target.value as 'swap' | 'donate')}
                  className="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                >
                  <option value="swap">Swap</option>
                  <option value="donate">Donate</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingTicket ? 'Update' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
