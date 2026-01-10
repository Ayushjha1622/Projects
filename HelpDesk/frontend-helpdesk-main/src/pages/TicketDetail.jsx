import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketsAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Select from '../components/Select';
import Textarea from '../components/Textarea';
import Spinner from '../components/Spinner';
import { ArrowLeft, Send, Clock, User, Calendar } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAgent } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await ticketsAPI.getTicketById(id);
      setTicket(response.data.ticket);
      setComments(response.data.comments);
      setTimeline(response.data.timeline);
    } catch (error) {
      console.error('Failed to fetch ticket:', error);
      if (error.response?.status === 404) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      await ticketsAPI.addComment(id, {
        content: commentText,
        isInternal,
      });
      setCommentText('');
      setIsInternal(false);
      await fetchTicketDetails();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTicket = async (field, value) => {
    if (!ticket) return;

    try {
      setUpdating(true);
      await ticketsAPI.updateTicket(id, {
        [field]: value,
        version: ticket.version,
      });
      await fetchTicketDetails();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      if (error.response?.data?.error?.code === 'STALE_UPDATE') {
        alert('Ticket has been modified. Refreshing...');
        await fetchTicketDetails();
      }
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTimelineIcon = (action) => {
    switch (action) {
      case 'created':
        return '🎫';
      case 'comment_added':
        return '💬';
      case 'status_changed':
        return '🔄';
      case 'priority_changed':
        return '⚡';
      case 'assigned':
        return '👤';
      case 'resolved':
        return '✅';
      case 'closed':
        return '🔒';
      case 'sla_breached':
        return '⚠️';
      default:
        return '📝';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!ticket) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Info */}
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.title}</h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={ticket.status}>{ticket.status}</Badge>
                    <Badge variant={ticket.priority}>{ticket.priority}</Badge>
                    {ticket.slaBreached && <Badge variant="danger">SLA Breached</Badge>}
                  </div>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Created by: {ticket.createdBy?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
                {ticket.assignedTo && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span>Assigned to: {ticket.assignedTo.name}</span>
                  </div>
                )}
                {ticket.slaDeadline && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>SLA: {formatDate(ticket.slaDeadline)}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Comments */}
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className={`p-4 rounded-lg ${
                        comment.isInternal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{comment.createdBy?.name}</span>
                          <Badge variant={comment.createdBy?.role} size="sm">
                            {comment.createdBy?.role}
                          </Badge>
                          {comment.isInternal && (
                            <Badge variant="warning" size="sm">Internal</Badge>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="border-t border-gray-200 pt-4">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  required
                />
                {isAgent && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isInternal"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="isInternal" className="text-sm text-gray-700">
                      Internal comment (only visible to agents)
                    </label>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <Button type="submit" disabled={submitting}>
                    <Send className="w-4 h-4 mr-2" />
                    {submitting ? 'Sending...' : 'Send Comment'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column - Actions & Timeline */}
          <div className="space-y-6">
            {/* Actions (Agent/Admin only) */}
            {isAgent && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-4">
                  <Select
                    label="Status"
                    value={ticket.status}
                    onChange={(e) => handleUpdateTicket('status', e.target.value)}
                    options={statusOptions}
                    disabled={updating}
                  />
                  <Select
                    label="Priority"
                    value={ticket.priority}
                    onChange={(e) => handleUpdateTicket('priority', e.target.value)}
                    options={priorityOptions}
                    disabled={updating}
                  />
                </div>
              </Card>
            )}

            {/* Timeline */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                {timeline.map((event) => (
                  <div key={event._id} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {getTimelineIcon(event.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {event.action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </p>
                      <p className="text-xs text-gray-500">{event.performedBy?.name}</p>
                      <p className="text-xs text-gray-400">{formatDate(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketDetail;