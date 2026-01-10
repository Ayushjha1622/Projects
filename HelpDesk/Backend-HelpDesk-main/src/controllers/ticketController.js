import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import Timeline from '../models/Timeline.js';
import mongoose from 'mongoose';

export const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'title',
          message: 'Title is required'
        }
      });
    }

    if (!description) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'description',
          message: 'Description is required'
        }
      });
    }

    // Calculate SLA deadline
    const ticketPriority = priority || 'medium';
    const slaDeadline = Ticket.calculateSLADeadline(ticketPriority);

    // Create ticket
    const ticket = await Ticket.create({
      title,
      description,
      priority: ticketPriority,
      createdBy: req.user._id,
      slaDeadline,
      status: 'open'
    });

    // Log timeline event
    await Timeline.logEvent(
      ticket._id,
      'created',
      req.user._id,
      {
        title,
        priority: ticketPriority
      }
    );

    // Populate creator info
    await ticket.populate('createdBy', 'name email role');

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

export const getTickets = async (req, res, next) => {
  try {
    const {
      limit = 20,
      offset = 0,
      status,
      priority,
      assignedTo,
      createdBy,
      search,
      slaBreached
    } = req.query;

    // Build query
    const query = {};

    // Role-based filtering
    if (req.user.role === 'user') {
      // Users can only see their own tickets
      query.createdBy = req.user._id;
    } else if (req.user.role === 'agent') {
      // Agents can see tickets assigned to them or unassigned tickets
      query.$or = [
        { assignedTo: req.user._id },
        { assignedTo: null }
      ];
    }
    // Admins can see all tickets (no additional filter)

    // Apply filters
    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (assignedTo) {
      query.assignedTo = assignedTo === 'null' ? null : assignedTo;
    }

    if (createdBy) {
      query.createdBy = createdBy;
    }

    if (slaBreached !== undefined) {
      query.slaBreached = slaBreached === 'true';
    }

    // Search in title, description, and latest comment
    if (search) {
      const searchRegex = new RegExp(search, 'i');

      // Find comments matching search
      const matchingComments = await Comment.find({
        content: searchRegex
      }).distinct('ticketId');

      // Combine queries
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { _id: { $in: matchingComments } }
      ];
    }

    // Get total count
    const total = await Ticket.countDocuments(query);

    // Get tickets with pagination
    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role')
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    // Update SLA breach status for each ticket
    for (const ticket of tickets) {
      if (ticket.checkSLABreach() && !ticket.slaBreached) {
        ticket.slaBreached = true;
        await ticket.save();
        
        // Log SLA breach
        await Timeline.logEvent(
          ticket._id,
          'sla_breached',
          req.user._id,
          { deadline: ticket.slaDeadline }
        );
      }
    }

    // Calculate next offset
    const nextOffset = parseInt(offset) + tickets.length < total
      ? parseInt(offset) + tickets.length
      : null;

    res.json({
      items: tickets,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      next_offset: nextOffset
    });
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ID',
          field: 'id',
          message: 'Invalid ticket ID format'
        }
      });
    }

    const ticket = await Ticket.findById(id)
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    if (!ticket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Ticket not found'
        }
      });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to view this ticket'
        }
      });
    }

    // Update SLA breach status
    if (ticket.checkSLABreach() && !ticket.slaBreached) {
      ticket.slaBreached = true;
      await ticket.save();
      
      // Log SLA breach
      await Timeline.logEvent(
        ticket._id,
        'sla_breached',
        req.user._id,
        { deadline: ticket.slaDeadline }
      );
    }

    // Get comments
    const comments = await Comment.find({ ticketId: id })
      .populate('createdBy', 'name email role')
      .sort({ createdAt: 1 });

    // Get timeline
    const timeline = await Timeline.find({ ticketId: id })
      .populate('performedBy', 'name email role')
      .sort({ timestamp: 1 });

    res.json({
      ticket,
      comments,
      timeline
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, version } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'INVALID_ID',
          field: 'id',
          message: 'Invalid ticket ID format'
        }
      });
    }

    // Optimistic locking check
    if (version === undefined) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'version',
          message: 'Version is required for optimistic locking'
        }
      });
    }

    const ticket = await Ticket.findById(id);

    if (!ticket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Ticket not found'
        }
      });
    }

    // Check version for optimistic locking
    if (ticket.version !== parseInt(version)) {
      return res.status(409).json({
        error: {
          code: 'STALE_UPDATE',
          message: 'Ticket has been modified by another user. Please refresh and try again.',
          currentVersion: ticket.version
        }
      });
    }

    // Check permissions
    if (req.user.role === 'user') {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'Only agents and admins can update tickets'
        }
      });
    }

    const updates = {};
    const timelineEvents = [];

    // Update status
    if (status && status !== ticket.status) {
      updates.status = status;
      timelineEvents.push({
        action: status === 'resolved' ? 'resolved' : status === 'closed' ? 'closed' : 'status_changed',
        details: { from: ticket.status, to: status }
      });

      if (status === 'resolved') {
        updates.resolvedAt = new Date();
      } else if (status === 'closed') {
        updates.closedAt = new Date();
      }
    }

    // Update priority
    if (priority && priority !== ticket.priority) {
      updates.priority = priority;
      updates.slaDeadline = Ticket.calculateSLADeadline(priority);
      timelineEvents.push({
        action: 'priority_changed',
        details: { from: ticket.priority, to: priority }
      });
    }

    // Update assignment
    if (assignedTo !== undefined) {
      const newAssignedTo = assignedTo === null || assignedTo === 'null' ? null : assignedTo;
      
      if (newAssignedTo !== ticket.assignedTo?.toString()) {
        updates.assignedTo = newAssignedTo;
        timelineEvents.push({
          action: newAssignedTo ? 'assigned' : 'unassigned',
          details: { 
            from: ticket.assignedTo,
            to: newAssignedTo
          }
        });
      }
    }

    // Increment version
    updates.version = ticket.version + 1;

    // Update ticket
    const updatedTicket = await Ticket.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email role')
      .populate('assignedTo', 'name email role');

    // Log timeline events
    for (const event of timelineEvents) {
      await Timeline.logEvent(
        ticket._id,
        event.action,
        req.user._id,
        event.details
      );
    }

    res.json(updatedTicket);
  } catch (error) {
    next(error);
  }
};