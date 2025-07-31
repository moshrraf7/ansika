const Chat = require('./models/Chat');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    // Join user's room
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle new messages
    socket.on('new-message', async (data) => {
      try {
        const { userId, message } = data;
        
        // Save to database
        const newChat = new Chat({
          user: userId,
          message,
        });
        await newChat.save();

        // Broadcast to admin
        io.to('admin').emit('new-message', newChat);
        
        // Send confirmation to user
        io.to(userId).emit('message-sent', newChat);
      } catch (error) {
        console.error('Error handling new message:', error);
      }
    });

    // Admin sends response
    socket.on('admin-response', async (data) => {
      try {
        const { chatId, response } = data;
        
        // Update in database
        const chat = await Chat.findByIdAndUpdate(
          chatId,
          { response, isRead: true },
          { new: true }
        );

        // Send response to user
        io.to(chat.user.toString()).emit('new-response', chat);
      } catch (error) {
        console.error('Error handling admin response:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};