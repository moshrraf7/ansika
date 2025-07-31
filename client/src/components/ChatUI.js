import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { format } from 'date-fns';

const ChatUI = () => {
  const { chatOpen, messages, newMessage, setNewMessage, sendMessage } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState('login');

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!user) {
      setAuthModalOpen(true);
      setAuthType('login');
      return;
    }
    sendMessage();
  };

  return (
    <>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-xl shadow-xl overflow-hidden z-40"
          >
            <div className="bg-pink-600 text-white p-4 font-semibold">
              Chat with Anshika
            </div>
            
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  {user ? 'Start chatting with Anshika!' : 'Login to start chatting'}
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.user === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${message.user === user?.id ? 'bg-pink-100 text-gray-800' : 'bg-gray-200 text-gray-800'}`}
                    >
                      <p>{message.message}</p>
                      {message.response && (
                        <div className="mt-2 p-2 bg-white rounded">
                          <p>{message.response}</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        {format(new Date(message.timestamp), 'hh:mm a')}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authType}
        onSwitchType={() => setAuthType(authType === 'login' ? 'signup' : 'login')}
      />
    </>
  );
};

export default ChatUI;