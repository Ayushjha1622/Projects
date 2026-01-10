import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ticketsAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Select from '../components/Select';
import Input from '../components/Input';
import Spinner from '../components/Spinner';
import { Plus, LogOut, Search, Filter, Ticket } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
  });

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
  ];

  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const response = await ticketsAPI.getTickets(params);
      setTickets(response.data.items);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Helpdesk</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={user?.role === 'admin' ? 'danger' : user?.role === 'agent' ? 'warning' : 'default'}>
                {user?.role}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Tickets</h2>
          <Button onClick={() => navigate('/tickets/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Filters</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search tickets..."
                className="pl-10"
              />
            </div>
            <Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              options={statusOptions}
            />
            <Select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              options={priorityOptions}
            />
          </div>
        </Card>

        {/* Tickets List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : tickets.length === 0 ? (
          <Card className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-600 mb-6">Create your first ticket to get started</p>
            <Button onClick={() => navigate('/tickets/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Create Ticket
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tickets.map((ticket) => (
              <Card
                key={ticket._id}
                hover
                onClick={() => navigate(`/tickets/${ticket._id}`)}
                className="cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {ticket.title}
                      </h3>
                      <div className="flex gap-2 flex-shrink-0">
                        <Badge variant={ticket.status}>{ticket.status}</Badge>
                        <Badge variant={ticket.priority}>{ticket.priority}</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 line-clamp-2 mb-3">{ticket.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>Created by: {ticket.createdBy?.name}</span>
                      {ticket.assignedTo && (
                        <span>Assigned to: {ticket.assignedTo.name}</span>
                      )}
                      <span>{formatDate(ticket.createdAt)}</span>
                      {ticket.slaBreached && (
                        <Badge variant="danger" size="sm">SLA Breached</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;