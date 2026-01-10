import Comment from '../models/Comment.js';
import Ticket from '../models/Ticket.js';
import Timeline from '../models/Timeline.js';
import mongoose from 'mongoose';

export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, isInternal } = req.body;

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

    // Validate required fields
    if (!content) {
      return res.status(400).json({
        error: {
          code: 'FIELD_REQUIRED',
          field: 'content',
          message: 'Content is required'
        }
      });
    }

    // Check if ticket exists
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Ticket not found'
        }
      });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to comment on this ticket'
        }
      });
    }

    // Only agents and admins can create internal comments
    const commentIsInternal = (req.user.role === 'agent' || req.user.role === 'admin') && isInternal === true;

    // Create comment
    const comment = await Comment.create({
      ticketId: id,
      content,
      createdBy: req.user._id,
      isInternal: commentIsInternal
    });

    // Populate creator info
    await comment.populate('createdBy', 'name email role');

    // Log timeline event
    await Timeline.logEvent(
      ticket._id,
      'comment_added',
      req.user._id,
      {
        commentId: comment._id,
        isInternal: commentIsInternal
      }
    );

    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

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

    // Check if ticket exists
    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Ticket not found'
        }
      });
    }

    // Check permissions
    if (req.user.role === 'user' && ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to view comments on this ticket'
        }
      });
    }

    // Build query - users can't see internal comments
    const query = { ticketId: id };
    if (req.user.role === 'user') {
      query.isInternal = false;
    }

    // Get total count
    const total = await Comment.countDocuments(query);

    // Get comments with pagination
    const comments = await Comment.find(query)
      .populate('createdBy', 'name email role')
      .sort({ createdAt: 1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    // Calculate next offset
    const nextOffset = parseInt(offset) + comments.length < total
      ? parseInt(offset) + comments.length
      : null;

    res.json({
      items: comments,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      next_offset: nextOffset
    });
  } catch (error) {
    next(error);
  }
};