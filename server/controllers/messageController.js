const Message = require('../models/Message');
const User = require('../models/User');

const generateMessageId = () => {
  return 'M' + Date.now().toString().slice(-4) + Math.random().toString(36).substr(2, 4).toUpperCase();
};

const generateConversationId = (userId1, userId2) => {
  return [userId1, userId2].sort().join('-');
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const messageId = generateMessageId();
    const conversationId = generateConversationId(req.user.userId, receiverId);

    const message = new Message({
      messageId,
      conversationId,
      sender: req.user.userId,
      receiver: receiverId,
      text
    });

    await message.save();
    await message.populate('sender', 'name profilePhoto');
    await message.populate('receiver', 'name profilePhoto');

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.userId },
        { receiver: req.user.userId }
      ]
    })
      .populate('sender', 'name profilePhoto')
      .populate('receiver', 'name profilePhoto')
      .sort({ createdAt: -1 });

    const conversationsMap = new Map();

    messages.forEach(msg => {
      const conversationId = msg.conversationId;
      if (!conversationsMap.has(conversationId)) {
        const otherUser = msg.sender._id.toString() === req.user.userId 
          ? msg.receiver 
          : msg.sender;
        
        const unreadCount = messages.filter(m => 
          m.conversationId === conversationId &&
          m.receiver._id.toString() === req.user.userId &&
          !m.read
        ).length;

        conversationsMap.set(conversationId, {
          conversationId,
          otherUser,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          unreadCount
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.params;

    const conversationId = generateConversationId(req.user.userId, otherUserId);

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name profilePhoto')
      .populate('receiver', 'name profilePhoto')
      .sort({ createdAt: 1 });

    await Message.updateMany(
      {
        conversationId,
        receiver: req.user.userId,
        read: false
      },
      {
        read: true,
        readAt: new Date()
      }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    if (message.receiver.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    message.read = true;
    message.readAt = new Date();
    await message.save();

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

