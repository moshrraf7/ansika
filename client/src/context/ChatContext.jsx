import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: { token: user.token },
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('join', user.id);
      });

      newSocket.on('new-response', (message) => {
        setMessages(prev => [...prev, message]);
      });

      setSocket(newSocket);

      // Load chat history
      const loadChatHistory = async () => {
        try {
          const response = await axios.get('/api/chat', {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setMessages(response.data.chats);
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      };

      loadChatHistory();

      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !socket || !user) return;

    try {
      const messageData = {
        userId: user.id,
        message: newMessage,
      };

      // Optimistically add to UI
      const tempId = Date.now();
      setMessages(prev => [...prev, {
        _id: tempId,
        user: user.id,
        message: newMessage,
        response: null,
        timestamp: new Date(),
        isRead: false,
      }]);

      // Send via socket
      socket.emit('new-message', messageData);

      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <ChatContext.Provider value={{
      chatOpen,
      setChatOpen,
      messages,
      newMessage,
      setNewMessage,
      sendMessage,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);