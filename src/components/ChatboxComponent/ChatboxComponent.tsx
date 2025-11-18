'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  message: string;
  from: string;
}

interface ChatboxComponentProps {
  socket: any; // Replace with proper Socket.IO type if needed
}

export default function ChatboxComponent({ socket }: ChatboxComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!socket) return;

    // Handle receiving messages from the server
    socket.on('receiveMessage', (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      // Clean up socket event listener when component is unmounted
      socket.off('receiveMessage');
    };
  }, [socket]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '' && socket) {
      // Send the message to the server
      socket.emit('sendMessage', { message: newMessage });

      // Update the local state
      setMessages((prevMessages) => [...prevMessages, { message: newMessage, from: 'Me' }]);
      setNewMessage('');
    }
  };

  return (
    <div>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.from}:</strong> {message.message}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}
