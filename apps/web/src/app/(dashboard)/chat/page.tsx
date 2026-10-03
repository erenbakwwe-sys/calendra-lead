"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePortalStore } from '@/stores/portalStore';
import { 
  MessageSquare, Send, Hash, Users, Sparkles, 
  Smile, Paperclip, CheckCheck, Circle 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ChatPage() {
  const { chatMessages, sendChatMessage } = usePortalStore();
  const [activeChannel, setActiveChannel] = useState('allgemein');
  const [inputText, setInputText] = useState('');

  const channels = [
    { id: 'allgemein', name: 'allgemein', unread: 0 },
    { id: 'leads-alert', name: 'leads-alert (API)', unread: 2 },
    { id: 'team-alpha', name: 'team-alpha (Berlin)', unread: 0 },
  ];

  const directUsers = [
    { name: 'Ahmet Yilmaz (TL)', role: 'team_leader', online: true },
    { name: 'Mehmet Demir', role: 'agent', online: true },
    { name: 'Ayşe Kaya', role: 'agent', online: true },
    { name: 'Lisa Müller', role: 'qc', online: false },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText, activeChannel);
    setInputText('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-2.5">
          <MessageSquare className="text-gold-500" size={24} />
          <span>Team-Chat & Interne Kommunikation</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Echtzeit-Austausch zwischen Teamleitern, Agenten und QC-Prüfern
        </p>
      </div>

      {/* Main Chat Layout */}
      <div className="flex-1 bg-dark-900 border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex">
        {/* Sidebar: Channels & Users */}
        <div className="w-64 border-r border-dark-border bg-dark-850 p-4 space-y-6 hidden sm:block">
          {/* Channels */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2">
              Kanäle
            </span>
            <div className="space-y-1">
              {channels.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeChannel === ch.id
                      ? 'bg-gold-500 text-dark-950 font-bold shadow-md shadow-gold-500/20'
                      : 'text-gray-400 hover:bg-dark-800 hover:text-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash size={14} />
                    <span>{ch.name}</span>
                  </div>
                  {ch.unread > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-dark-950">
                      {ch.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Members */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2">
              Kollegen Online
            </span>
            <div className="space-y-1">
              {directUsers.map((m) => (
                <div key={m.name} className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-300 hover:bg-dark-800 cursor-pointer">
                  <div className="flex items-center gap-2 truncate">
                    <span className={`h-2 w-2 rounded-full ${m.online ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                    <span className="truncate">{m.name}</span>
                  </div>
                  <span className="text-[9px] uppercase font-bold text-gold-400/80">{m.role.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 flex flex-col bg-dark-900">
          {/* Channel Header */}
          <div className="px-6 py-3.5 border-b border-dark-border bg-dark-850/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-100">
              <Hash size={16} className="text-gold-500" />
              <span>{activeChannel}</span>
            </div>
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Echtzeit-Socket verbunden
            </span>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 text-xs animate-in fade-in">
                <div className="h-8 w-8 rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                  {msg.sender.charAt(0)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-200">{msg.sender}</span>
                    <span className="text-[10px] text-gray-500">{msg.createdAt}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-dark-850 text-gold-400 font-mono">
                      {msg.role}
                    </span>
                  </div>
                  <div className="bg-dark-850 p-3 rounded-2xl rounded-tl-none border border-dark-border text-gray-300 leading-relaxed max-w-xl">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-4 border-t border-dark-border bg-dark-850/50 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Nachricht an #${activeChannel} senden...`}
              className="flex-1 bg-dark-900 border border-dark-border rounded-xl px-4 py-2.5 text-xs text-gray-100 focus:border-gold-500 focus:outline-none transition-colors"
            />
            <Button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-dark-950 font-bold px-4 py-2.5 rounded-xl shadow-md shadow-gold-500/20"
            >
              <Send size={15} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
