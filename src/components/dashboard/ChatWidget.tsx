import React, { useState, useEffect, useRef } from 'react';
import styles from './ChatWidget.module.css';

interface Message {
  _id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: string[];
  type: string;
  createdAt: string;
}

const ChatWidget: React.FC<{ userId: string }> = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupère les conversations de l'utilisateur
  useEffect(() => {
    if (open) {
      fetch(`/api/chat?userId=${userId}`)
        .then(res => res.json())
        .then(setConversations);
    }
  }, [open, userId]);

  // Récupère les messages de la conversation sélectionnée
  useEffect(() => {
    if (selectedConv) {
      fetch(`/api/chat?conversationId=${selectedConv._id}`)
        .then(res => res.json())
        .then(setMessages);
    }
  }, [selectedConv]);

  // Scroll auto en bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Rafraîchissement auto (polling)
  useEffect(() => {
    if (!selectedConv) return;
    const interval = setInterval(() => {
      fetch(`/api/chat?conversationId=${selectedConv._id}`)
        .then(res => res.json())
        .then(setMessages);
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedConv]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedConv) return;
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: selectedConv._id,
        senderId: userId,
        content: input,
      }),
    });
    if (res.ok) {
      setInput('');
      fetch(`/api/chat?conversationId=${selectedConv._id}`)
        .then(res => res.json())
        .then(setMessages);
    }
  };

  return (
    <div className={styles.widgetContainer}>
      {!open && (
        <button className={styles.fab} onClick={() => setOpen(true)} title="Support">
          💬
        </button>
      )}
      {open && (
        <div className={styles.chatBox}>
          <div className={styles.header}>
            <span>Support</span>
            <button onClick={() => setOpen(false)} className={styles.closeBtn}>×</button>
          </div>
          {!selectedConv ? (
            <div className={styles.convList}>
              <h4>Vos conversations</h4>
              <ul>
                {conversations.map(conv => (
                  <li key={conv._id}>
                    <button onClick={() => setSelectedConv(conv)}>
                      {conv.type === 'support' ? 'Support' : conv.participants.filter(p => p !== userId).join(', ')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className={styles.messagesSection}>
              <button className={styles.backBtn} onClick={() => setSelectedConv(null)}>&lt; Retour</button>
              <div className={styles.messages}>
                {messages.map(msg => (
                  <div key={msg._id} className={msg.senderId === userId ? styles.msgSelf : styles.msgOther}>
                    <span>{msg.content}</span>
                    <div className={styles.msgDate}>{new Date(msg.createdAt).toLocaleTimeString()}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className={styles.inputBar} onSubmit={handleSend}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Votre message..."
                  autoFocus
                />
                <button type="submit">Envoyer</button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
