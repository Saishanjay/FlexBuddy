import React, { useState, useEffect, useRef } from 'react';
import { TeamMember, ChatMessage, UserProfile } from '../types';
import {
  Send,
  MessageSquare,
  Bot,
  Sparkles,
  Users,
  CheckCheck,
  Smile,
  Paperclip,
} from 'lucide-react';

interface ChatProps {
  currentUser: UserProfile;
  teamMembers: TeamMember[];
  selectedMemberId?: string;
}

export const Chat: React.FC<ChatProps> = ({
  currentUser,
  teamMembers,
  selectedMemberId,
}) => {
  // Exclude current user from teammates to chat with
  const availableTeammates = teamMembers.filter((m) => !m.isOwner);

  // Active chat partner
  const [activePartnerId, setActivePartnerId] = useState<string>(
    selectedMemberId && availableTeammates.some((m) => m.id === selectedMemberId)
      ? selectedMemberId
      : availableTeammates[0]?.id || '1'
  );

  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat messages from localStorage or use initial demo messages
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('flexbuddy_chat_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default demo messages from Section 13
    return [
      {
        id: 'msg-1',
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: '1', // Priya
        text: 'Hey Priya! Your frontend skills look perfect for our project.',
        timestamp: '10:30 AM',
      },
      {
        id: 'msg-2',
        senderId: '1',
        senderName: 'Priya',
        recipientId: currentUser.id,
        text: "Thanks Arun! I'd love to collaborate. I have already designed similar wireframes in Figma.",
        timestamp: '10:32 AM',
      },
    ];
  });

  // Save messages to localStorage
  useEffect(() => {
    localStorage.setItem('flexbuddy_chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activePartner =
    teamMembers.find((m) => m.id === activePartnerId) || availableTeammates[0];

  // Filter messages between current user and active partner
  const currentThread = messages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === activePartner?.id) ||
      (m.senderId === activePartner?.id && m.recipientId === currentUser.id)
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activePartner) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      recipientId: activePartner.id,
      text: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulated teammate auto-reply after 1.2s for interactive hackathon demonstration
    setTimeout(() => {
      const replies = [
        `Awesome idea, ${currentUser.name}! Let's build the API endpoints first so I can bind the UI.`,
        `Checked the requirements—my schedule aligns well for this evening's sprint session!`,
        `Sounds perfect. I will draft the initial architecture flow right away.`,
        `Great! I'll share the Figma components and wireframes in our workspace shortly.`,
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const autoReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        senderId: activePartner.id,
        senderName: activePartner.name,
        recipientId: currentUser.id,
        text: randomReply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1200);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-xs overflow-hidden h-[calc(100vh-140px)] min-h-[500px] flex">
      {/* Teammates List (Left Sidebar) */}
      <div className="w-72 lg:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200/80 bg-white">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Team Messages
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Direct coordination with your hackathon squad
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {availableTeammates.length > 0 ? (
            availableTeammates.map((teammate) => {
              const isSelected = teammate.id === activePartner?.id;
              return (
                <button
                  key={teammate.id}
                  onClick={() => setActivePartnerId(teammate.id)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-white shadow-xs border border-slate-200/80'
                      : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {teammate.name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {teammate.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">Online</span>
                    </div>
                    <p className="text-[11px] text-indigo-600 font-medium truncate">
                      {teammate.role}
                    </p>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No other teammates connected yet. Go to Find Teammates to recruit squad members!
            </div>
          )}
        </div>
      </div>

      {/* Active Chat Conversation View */}
      {activePartner ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Active Partner Top Bar */}
          <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                {activePartner.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activePartner.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{activePartner.role}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">
                    {activePartner.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hackathon Project Room</span>
            </div>
          </div>

          {/* Chat Messages Scroll Window */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
            {currentThread.map((msg) => {
              const isMe = msg.senderId === currentUser.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    isMe ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[11px] font-bold text-slate-700">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe
                        ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-3"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${activePartner.name}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />

            <button
              id="send-chat-btn"
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
          <Users className="w-12 h-12 text-slate-300 mb-2" />
          <p className="text-sm font-semibold">Select a teammate to start chatting</p>
        </div>
      )}
    </div>
  );
};
