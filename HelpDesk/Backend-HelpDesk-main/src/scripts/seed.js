import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Ticket from '../models/Ticket.js';
import Comment from '../models/Comment.js';
import Timeline from '../models/Timeline.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/helpdesk');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Comment.deleteMany({});
    await Timeline.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        email: 'admin@helpdesk.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      },
      {
        email: 'agent1@helpdesk.com',
        password: 'agent123',
        name: 'Agent One',
        role: 'agent'
      },
      {
        email: 'agent2@helpdesk.com',
        password: 'agent123',
        name: 'Agent Two',
        role: 'agent'
      },
      {
        email: 'user1@example.com',
        password: 'user123',
        name: 'John Doe',
        role: 'user'
      },
      {
        email: 'user2@example.com',
        password: 'user123',
        name: 'Jane Smith',
        role: 'user'
      }
    ]);

    console.log('Created users:', users.length);

    const [, agent1, agent2, user1, user2] = users;

    // Create tickets with various states
    const tickets = [];

    // Ticket 1: Open ticket - not breached
    const ticket1 = await Ticket.create({
      title: 'Cannot login to account',
      description: 'I am unable to login to my account. Getting "Invalid credentials" error.',
      priority: 'high',
      status: 'open',
      createdBy: user1._id,
      slaDeadline: Ticket.calculateSLADeadline('high')
    });
    tickets.push(ticket1);
    await Timeline.logEvent(ticket1._id, 'created', user1._id, { title: ticket1.title, priority: 'high' });

    // Ticket 2: In progress ticket - assigned
    const ticket2 = await Ticket.create({
      title: 'Feature request: Dark mode',
      description: 'Would love to have a dark mode option in the application.',
      priority: 'low',
      status: 'in_progress',
      createdBy: user2._id,
      assignedTo: agent1._id,
      slaDeadline: Ticket.calculateSLADeadline('low')
    });
    tickets.push(ticket2);
    await Timeline.logEvent(ticket2._id, 'created', user2._id, { title: ticket2.title, priority: 'low' });
    await Timeline.logEvent(ticket2._id, 'assigned', agent1._id, { to: agent1._id });
    await Timeline.logEvent(ticket2._id, 'status_changed', agent1._id, { from: 'open', to: 'in_progress' });

    // Ticket 3: Resolved ticket
    const ticket3 = await Ticket.create({
      title: 'Email notifications not working',
      description: 'I am not receiving email notifications for new messages.',
      priority: 'medium',
      status: 'resolved',
      createdBy: user1._id,
      assignedTo: agent2._id,
      slaDeadline: Ticket.calculateSLADeadline('medium'),
      resolvedAt: new Date()
    });
    tickets.push(ticket3);
    await Timeline.logEvent(ticket3._id, 'created', user1._id, { title: ticket3.title, priority: 'medium' });
    await Timeline.logEvent(ticket3._id, 'assigned', agent2._id, { to: agent2._id });
    await Timeline.logEvent(ticket3._id, 'resolved', agent2._id, {});

    // Ticket 4: SLA breached ticket
    const breachedDeadline = new Date();
    breachedDeadline.setHours(breachedDeadline.getHours() - 2); // 2 hours ago
    const ticket4 = await Ticket.create({
      title: 'Critical: System down',
      description: 'The entire system is down and users cannot access the application.',
      priority: 'critical',
      status: 'in_progress',
      createdBy: user2._id,
      assignedTo: agent1._id,
      slaDeadline: breachedDeadline,
      slaBreached: true
    });
    tickets.push(ticket4);
    await Timeline.logEvent(ticket4._id, 'created', user2._id, { title: ticket4.title, priority: 'critical' });
    await Timeline.logEvent(ticket4._id, 'assigned', agent1._id, { to: agent1._id });
    await Timeline.logEvent(ticket4._id, 'sla_breached', agent1._id, { deadline: breachedDeadline });

    // Ticket 5: Ticket with multiple comments
    const ticket5 = await Ticket.create({
      title: 'How to reset password?',
      description: 'I forgot my password and need help resetting it.',
      priority: 'medium',
      status: 'in_progress',
      createdBy: user1._id,
      assignedTo: agent2._id,
      slaDeadline: Ticket.calculateSLADeadline('medium')
    });
    tickets.push(ticket5);
    await Timeline.logEvent(ticket5._id, 'created', user1._id, { title: ticket5.title, priority: 'medium' });
    await Timeline.logEvent(ticket5._id, 'assigned', agent2._id, { to: agent2._id });

    // Add comments to ticket5
    const comment1 = await Comment.create({
      ticketId: ticket5._id,
      content: 'Please click on "Forgot Password" link on the login page.',
      createdBy: agent2._id,
      isInternal: false
    });
    await Timeline.logEvent(ticket5._id, 'comment_added', agent2._id, { commentId: comment1._id });

    const comment2 = await Comment.create({
      ticketId: ticket5._id,
      content: 'I tried that but did not receive the reset email.',
      createdBy: user1._id,
      isInternal: false
    });
    await Timeline.logEvent(ticket5._id, 'comment_added', user1._id, { commentId: comment2._id });

    const comment3 = await Comment.create({
      ticketId: ticket5._id,
      content: 'Internal note: Check spam folder and email service logs.',
      createdBy: agent2._id,
      isInternal: true
    });
    await Timeline.logEvent(ticket5._id, 'comment_added', agent2._id, { commentId: comment3._id, isInternal: true });

    console.log('Created tickets:', tickets.length);
    console.log('Created comments: 3');

    console.log('\n=== Seed Data Summary ===');
    console.log('\nTest Users:');
    console.log('Admin: admin@helpdesk.com / admin123');
    console.log('Agent 1: agent1@helpdesk.com / agent123');
    console.log('Agent 2: agent2@helpdesk.com / agent123');
    console.log('User 1: user1@example.com / user123');
    console.log('User 2: user2@example.com / user123');
    
    console.log('\nTickets Created:');
    console.log('- 1 open ticket (high priority)');
    console.log('- 1 in-progress ticket (low priority)');
    console.log('- 1 resolved ticket (medium priority)');
    console.log('- 1 SLA breached ticket (critical priority)');
    console.log('- 1 ticket with comments (medium priority)');

    console.log('\nDatabase seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();