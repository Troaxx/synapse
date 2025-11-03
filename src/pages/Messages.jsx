import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Messages = () => {
  const navigate = useNavigate();
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    {
      id: 1,
      tutor: "Sarah Chen",
      tutorImage: "/assets/tutor1.png",
      lastMessage: "See you tomorrow at 2 PM!",
      timestamp: "2 hours ago",
      unread: 2
    },
    {
      id: 2,
      tutor: "Marcus Tan",
      tutorImage: "/assets/tutor2.png",
      lastMessage: "Sure, I can help you with React hooks",
      timestamp: "5 hours ago",
      unread: 0
    },
    {
      id: 3,
      tutor: "Priya Kumar",
      tutorImage: "/assets/tutor3.png",
      lastMessage: "Let me know if you need any clarification",
      timestamp: "1 day ago",
      unread: 1
    },
    {
      id: 4,
      tutor: "David Lim",
      tutorImage: "/assets/tutor4.png",
      lastMessage: "Great session today!",
      timestamp: "2 days ago",
      unread: 0
    }
  ];

  const messages = {
    1: [
      { id: 1, sender: "tutor", text: "Hi! Thanks for booking a session with me.", timestamp: "10:30 AM" },
      { id: 2, sender: "student", text: "Hi Sarah! Looking forward to learning Python with you.", timestamp: "10:32 AM" },
      { id: 3, sender: "tutor", text: "Great! What specific topics would you like to cover?", timestamp: "10:35 AM" },
      { id: 4, sender: "student", text: "I'm struggling with object-oriented programming concepts, especially inheritance and polymorphism.", timestamp: "10:37 AM" },
      { id: 5, sender: "tutor", text: "Perfect! I'll prepare some examples for our session tomorrow. We'll go through it step by step.", timestamp: "10:40 AM" },
      { id: 6, sender: "student", text: "That sounds great! Thank you so much.", timestamp: "10:42 AM" },
      { id: 7, sender: "tutor", text: "See you tomorrow at 2 PM!", timestamp: "10:45 AM" }
    ],
    2: [
      { id: 1, sender: "student", text: "Hi Marcus! I need help with React hooks.", timestamp: "Yesterday" },
      { id: 2, sender: "tutor", text: "Sure, I can help you with React hooks", timestamp: "Yesterday" }
    ],
    3: [
      { id: 1, sender: "tutor", text: "Let me know if you need any clarification", timestamp: "2 days ago" }
    ],
    4: [
      { id: 1, sender: "student", text: "Thank you for the session!", timestamp: "2 days ago" },
      { id: 2, sender: "tutor", text: "Great session today!", timestamp: "2 days ago" }
    ]
  };

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const currentMessages = messages[selectedConversation] || [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

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
              <div className="divide-y divide-gray-200">
                {conversations.map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        {conversation.unread > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                            {conversation.unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{conversation.tutor}</h3>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      <div className="text-xs text-gray-500">{conversation.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:flex md:flex-col flex-1">
              {currentConversation && (
                <>
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <h2 className="font-bold text-gray-900">{currentConversation.tutor}</h2>
                          <p className="text-sm text-green-600">Online</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/booking/${selectedConversation}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                        >
                          Book Session
                        </button>
                        <button
                          onClick={() => navigate(`/tutor/${selectedConversation}`)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {currentMessages.map(message => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.sender === 'student'
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.sender === 'student' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

