import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Send, MessageCircle, Search, Paperclip } from "lucide-react";
import { Link } from 'react-router-dom';

interface Chat {
  id: string;
  client_id: string;
  worker_id: string;
  created_at: string;
  updated_at: string;
  client?: {
    full_name: string;
    avatar_url: string;
  };
  worker?: {
    full_name: string;
    avatar_url: string;
  };
  latest_message?: {
    text: string;
    sent_at: string;
    sender_id: string;
  };
}

interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  text: string;
  sent_at: string;
  is_offer: boolean;
  offer_data: any;
  sender?: {
    full_name: string;
    avatar_url: string;
  };
}

const Messages = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchChats();
    }
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      
      // Set up real-time subscription for messages
      const channel = supabase
        .channel(`chat-${selectedChat.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${selectedChat.id}`
          },
          (payload) => {
            setMessages(prev => [...prev, payload.new as Message]);
            scrollToBottom();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChats = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          client:users!chats_client_id_fkey (
            full_name,
            avatar_url
          ),
          worker:users!chats_worker_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .or(`client_id.eq.${user.id},worker_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats(data || []);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({ title: "خطأ", description: "فشل في تحميل المحادثات", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    setMessagesLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users (
            full_name,
            avatar_url
          )
        `)
        .eq('chat_id', chatId)
        .order('sent_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({ title: "خطأ", description: "فشل في تحميل الرسائل", variant: "destructive" });
    } finally {
      setMessagesLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || !user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          chat_id: selectedChat.id,
          sender_id: user.id,
          text: newMessage.trim(),
          is_offer: false
        }]);

      if (error) throw error;
      
      // Update chat's updated_at timestamp
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', selectedChat.id);

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: "خطأ", description: "فشل في إرسال الرسالة", variant: "destructive" });
    }
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.client_id === user?.id ? chat.worker : chat.client;
    return otherUser?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ar-MA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'اليوم';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'أمس';
    } else {
      return date.toLocaleDateString('ar-MA');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-stone-600">جاري تحميل المحادثات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <MessageCircle className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-stone-900">كرافتد - الرسائل</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link to="/jobs" className="text-stone-600 hover:text-stone-900">
                الوظائف
              </Link>
              <Link to="/" className="text-stone-600 hover:text-stone-900">
                الرئيسية
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>المحادثات</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <Input
                  placeholder="ابحث في المحادثات..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto">
                {filteredChats.length === 0 ? (
                  <div className="text-center py-8 text-stone-500">
                    لا توجد محادثات
                  </div>
                ) : (
                  filteredChats.map((chat) => {
                    const otherUser = chat.client_id === user?.id ? chat.worker : chat.client;
                    const isSelected = selectedChat?.id === chat.id;
                    
                    return (
                      <div
                        key={chat.id}
                        onClick={() => setSelectedChat(chat)}
                        className={`p-4 border-b cursor-pointer hover:bg-stone-50 transition-colors ${
                          isSelected ? 'bg-orange-50 border-l-4 border-l-orange-600' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={otherUser?.avatar_url} />
                            <AvatarFallback>
                              {otherUser?.full_name?.charAt(0) || 'م'}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-stone-900 truncate">
                                {otherUser?.full_name}
                              </h3>
                              <span className="text-xs text-stone-500">
                                {formatDate(chat.updated_at)}
                              </span>
                            </div>
                            {chat.latest_message && (
                              <p className="text-sm text-stone-600 truncate">
                                {chat.latest_message.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Chat Messages */}
          <Card className="lg:col-span-2">
            {selectedChat ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={
                        selectedChat.client_id === user?.id 
                          ? selectedChat.worker?.avatar_url
                          : selectedChat.client?.avatar_url
                      } />
                      <AvatarFallback>
                        {(selectedChat.client_id === user?.id 
                          ? selectedChat.worker?.full_name
                          : selectedChat.client?.full_name)?.charAt(0) || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle>
                      {selectedChat.client_id === user?.id 
                        ? selectedChat.worker?.full_name
                        : selectedChat.client?.full_name}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="flex flex-col h-96">
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesLoading ? (
                      <div className="text-center text-stone-500">
                        جاري تحميل الرسائل...
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-stone-500">
                        لا توجد رسائل بعد
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isMyMessage = message.sender_id === user?.id;
                        
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isMyMessage
                                  ? 'bg-orange-600 text-white'
                                  : 'bg-stone-200 text-stone-900'
                              }`}
                            >
                              <p className="text-sm">{message.text}</p>
                              <p className={`text-xs mt-1 ${
                                isMyMessage ? 'text-orange-100' : 'text-stone-500'
                              }`}>
                                {formatTime(message.sent_at)}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Message Input */}
                  <form onSubmit={sendMessage} className="border-t p-4">
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline" size="sm">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك..."
                        className="flex-1"
                      />
                      <Button type="submit" size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center text-stone-500">
                  <MessageCircle className="h-16 w-16 mx-auto mb-4 text-stone-300" />
                  <p>اختر محادثة لبدء المراسلة</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;