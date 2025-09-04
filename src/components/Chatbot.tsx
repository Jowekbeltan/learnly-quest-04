import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useConversation } from '@11labs/react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onClose?: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ElevenLabs Conversation AI
  const conversation = useConversation({
    onConnect: () => {
      setIsVoiceMode(true);
      toast.success('Voice chat connected!');
    },
    onDisconnect: () => {
      setIsVoiceMode(false);
      toast.info('Voice chat disconnected');
    },
    onMessage: (message) => {
      if (message.type === 'agent_response') {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: message.message,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, newMessage]);
        saveMessageToDatabase(newMessage);
      }
    },
    onError: (error) => {
      console.error('Voice chat error:', error);
      toast.error('Voice chat error occurred');
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are a helpful learning assistant for students. You can answer questions about science, mathematics, technology, languages, and social studies. Be encouraging and educational in your responses. Keep answers clear and age-appropriate.`
        },
        firstMessage: "Hi! I'm your learning assistant. I can help you with your studies or answer any questions you have. How can I help you today?",
        language: "en"
      }
    }
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      initializeConversation();
    }
  }, [user]);

  const initializeConversation = async () => {
    if (!user) return;

    try {
      // Create or get existing conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ user_id: user.id })
        .select()
        .single();

      if (error) throw error;

      setConversationId(data.id);
      
      // Load previous messages
      loadMessages(data.id);

      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: "Hi! I'm your learning assistant. I can help you with your studies or answer any questions you have. How can I help you today?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);

    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Failed to initialize chat');
    }
  };

  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const loadedMessages: Message[] = data.map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
        timestamp: new Date(msg.created_at)
      }));

      setMessages(prev => [...prev, ...loadedMessages]);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const saveMessageToDatabase = async (message: Message) => {
    if (!conversationId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          role: message.role,
          content: message.content
        });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    saveMessageToDatabase(userMessage);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call OpenAI via Edge Function
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { 
          message: userMessage.content,
          conversationHistory: messages.slice(-10) // Send last 10 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      saveMessageToDatabase(assistantMessage);

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceChat = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Note: You'll need to get the agent ID from ElevenLabs dashboard
      // For now, we'll use a placeholder
      toast.info('Voice chat requires ElevenLabs agent configuration');
      
      // await conversation.startSession({ 
      //   agentId: 'your-agent-id' // Replace with actual agent ID
      // });
    } catch (error) {
      console.error('Voice chat error:', error);
      toast.error('Unable to start voice chat');
    }
  };

  const stopVoiceChat = async () => {
    await conversation.endSession();
  };

  return (
    <Card className="w-full max-w-md h-96 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Learning Assistant
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={isVoiceMode ? stopVoiceChat : startVoiceChat}
            className="h-8 w-8 p-0"
          >
            {isVoiceMode ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-4 space-y-4">
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-75" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {isVoiceMode && (
          <div className="flex items-center justify-center p-2 bg-primary/10 rounded-lg">
            <Badge variant="secondary" className="flex items-center gap-2">
              {conversation.isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              {conversation.isSpeaking ? 'Assistant Speaking' : 'Voice Mode Active'}
            </Badge>
          </div>
        )}

        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isVoiceMode ? "Voice mode active..." : "Ask me anything about your studies..."}
            disabled={isLoading || isVoiceMode}
            className="flex-1"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim() || isVoiceMode}
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chatbot;