import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  slaDeadline: {
    type: Date,
    required: true
  },
  slaBreached: {
    type: Boolean,
    default: false
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  },
  version: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ slaBreached: 1 });
ticketSchema.index({ slaDeadline: 1 });
ticketSchema.index({ title: 'text', description: 'text' });

// Calculate SLA deadline based on priority
ticketSchema.statics.calculateSLADeadline = function (priority) {
  const slaMinutes = {
    low: parseInt(process.env.SLA_LOW_PRIORITY) || 2880,      // 48 hours
    medium: parseInt(process.env.SLA_MEDIUM_PRIORITY) || 1440, // 24 hours
    high: parseInt(process.env.SLA_HIGH_PRIORITY) || 480,      // 8 hours
    critical: parseInt(process.env.SLA_CRITICAL_PRIORITY) || 240 // 4 hours
  };

  const deadline = new Date();
  deadline.setMinutes(deadline.getMinutes() + slaMinutes[priority]);
  return deadline;
};

// Method to check if SLA is breached
ticketSchema.methods.checkSLABreach = function () {
  if (this.status === 'resolved' || this.status === 'closed') {
    return false;
  }
  return new Date() > this.slaDeadline;
};

// Pre-save middleware to update SLA breach status
ticketSchema.pre('save', function (next) {
  if (this.status !== 'resolved' && this.status !== 'closed') {
    this.slaBreached = this.checkSLABreach();
  }
  next();
});

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;