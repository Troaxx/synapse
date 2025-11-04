import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { messageAPI } from '../services/api';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageAPI.getConversations();
      const conversationsData = response.data || [];
      const formatted = conversationsData.map(conv => ({
        conversationId: conv.conversationId,
        otherUserId: conv.otherUser?._id || conv.otherUser,
        otherUser: conv.otherUser,
        lastMessage: { text: conv.lastMessage, createdAt: conv.lastMessageTime },
        unreadCount: conv.unreadCount || 0
      }));
      setConversations(formatted);
      if (formatted.length > 0) {
        setSelectedConversation(formatted[0].otherUserId);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId) => {
    try {
      const response = await messageAPI.getMessages(otherUserId);
      setCurrentMessages(response.data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversation) return;
    
    try {
      await messageAPI.sendMessage({
        receiverId: selectedConversation,
        text: messageInput.trim()
      });
      setMessageInput('');
      await loadMessages(selectedConversation);
      await loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const currentConversationData = conversations.find(c => c.otherUserId === selectedConversation);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            <div className="w-full md:w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading conversations...</div>
              ) : conversations.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {conversations.map(conversation => (
                    <div
                      key={conversation.otherUserId}
                      onClick={() => setSelectedConversation(conversation.otherUserId)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation === conversation.otherUserId ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                            {conversation.otherUser?.profilePhoto ? (
                              <img src={conversation.otherUser.profilePhoto} alt={conversation.otherUser.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gray-400">
                                {conversation.otherUser?.name?.charAt(0) || '?'}
                              </div>
                            )}
                          </div>
                          {conversation.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                              {conversation.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{conversation.otherUser?.name || 'Unknown'}</h3>
                          <p className="text-sm text-gray-600 truncate">{conversation.lastMessage?.text || 'No messages'}</p>
                        </div>
                        <div className="text-xs text-gray-500">{formatTimestamp(conversation.lastMessage?.createdAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">No conversations yet</div>
              )}
            </div>

            <div className="hidden md:flex md:flex-col flex-1">
              {currentConversationData ? (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                          {currentConversationData.otherUser?.profilePhoto ? (
                            <img src={currentConversationData.otherUser.profilePhoto} alt={currentConversationData.otherUser.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-semibold bg-gray-400">
                              {currentConversationData.otherUser?.name?.charAt(0) || '?'}
                            </div>
                          )}
                        </div>
                        <div>
                          <h2 className="font-bold text-gray-900">{currentConversationData.otherUser?.name || 'Unknown'}</h2>
                          <p className="text-sm text-gray-600">Messaging</p>
                        </div>
                      </div>
                      {!user?.isTutor && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/tutor/${selectedConversation}`)}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                          >
                            View Profile
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {currentMessages.length > 0 ? (
                      currentMessages.map(message => {
                        const isCurrentUser = (message.sender?._id || message.sender) === (user?._id || user?.id);
                        return (
                          <div
                            key={message._id || message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white text-gray-900 border border-gray-200'
                              }`}
                            >
                              <p>{message.text}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTimestamp(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</div>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-200 bg-white">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  Select a conversation to start messaging
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

