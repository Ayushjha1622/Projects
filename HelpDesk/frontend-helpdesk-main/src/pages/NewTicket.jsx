import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketsAPI } from '../services/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import Card from '../components/Card';
import { ArrowLeft, Plus } from 'lucide-react';

const NewTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await ticketsAPI.createTicket(formData);
      navigate(`/tickets/${response.data._id}`);
    } catch (error) {
      const errorData = error.response?.data?.error;
      if (errorData?.field) {
        setErrors({ [errorData.field]: errorData.message });
      } else {
        setErrors({ general: errorData?.message || 'Failed to create ticket' });
      }
    } finally {
      setLoading(false);
    }
  };

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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
            <p className="text-gray-600 mt-1">Fill in the details below to create a support ticket</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <Input
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief description of the issue"
              required
              error={errors.title}
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed information about the issue..."
              rows={6}
              required
              error={errors.description}
            />

            <Select
              label="Priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              options={priorityOptions}
              required
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Ticket'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default NewTicket;