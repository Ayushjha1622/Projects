import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'created',
      'status_changed',
      'priority_changed',
      'assigned',
      'unassigned',
      'comment_added',
      'resolved',
      'closed',
      'reopened',
      'sla_breached'
    ]
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: false
});

// Compound index for efficient querying
timelineSchema.index({ ticketId: 1, timestamp: -1 });

// Static method to log timeline event
timelineSchema.statics.logEvent = async function (ticketId, action, performedBy, details = {}) {
  return await this.create({
    ticketId,
    action,
    performedBy,
    details,
    timestamp: new Date()
  });
};

const Timeline = mongoose.model('Timeline', timelineSchema);

export default Timeline;