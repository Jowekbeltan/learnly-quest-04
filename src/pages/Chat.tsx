import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Search, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Header from '@/components/Header';

interface Conversation {
  id: string;
  updated_at: string;
  other_user: {
    user_id: string;
    display_name: string;
    avatar_url: string | null;
  };
  last_message?: {
    content: string;
    created_at: string;
  };
}

interface User {
  user_id: string;
  display_name: string;
  avatar_url: string | null;
}

const Chat: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadConversations();
      loadUsers();
    }
  }, [user]);

  const loadConversations = async () => {
    try {
      const { data: participantsData, error: participantsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user!.id);

      if (participantsError) throw participantsError;

      const conversationIds = participantsData.map(p => p.conversation_id);

      if (conversationIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: conversationsData, error: conversationsError } = await supabase
        .from('peer_conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (conversationsError) throw conversationsError;

      const conversationsWithDetails = await Promise.all(
        conversationsData.map(async (conv) => {
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id)
            .neq('user_id', user!.id)
            .single();

          if (!participants) return null;

          const { data: profile } = await supabase
            .from('profiles')
            .select('user_id, display_name, avatar_url')
            .eq('user_id', participants.user_id)
            .single();

          const { data: lastMessage } = await supabase
            .from('peer_messages')
            .select('content, created_at')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          return {
            id: conv.id,
            updated_at: conv.updated_at,
            other_user: profile || {
              user_id: participants.user_id,
              display_name: 'Unknown User',
              avatar_url: null
            },
            last_message: lastMessage || undefined
          };
        })
      );

      setConversations(conversationsWithDetails.filter(c => c !== null) as Conversation[]);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .neq('user_id', user!.id)
        .limit(50);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const startConversation = async (otherUserId: string) => {
    try {
      const { data: existingParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user!.id);

      if (existingParticipants) {
        for (const participant of existingParticipants) {
          const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', participant.conversation_id)
            .eq('user_id', otherUserId)
            .single();

          if (otherParticipant) {
            navigate(`/chat/${participant.conversation_id}`);
            return;
          }
        }
      }

      const { data: conversation, error: convError } = await supabase
        .from('peer_conversations')
        .insert({})
        .select()
        .single();

      if (convError) throw convError;

      const { error: participantError } = await supabase
        .from('conversation_participants')
        .insert([
          { conversation_id: conversation.id, user_id: user!.id },
          { conversation_id: conversation.id, user_id: otherUserId }
        ]);

      if (participantError) throw participantError;

      navigate(`/chat/${conversation.id}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation');
    }
  };

  const filteredUsers = users.filter(u =>
    u.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 mt-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Chat with Learners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="conversations" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="conversations">My Conversations</TabsTrigger>
                <TabsTrigger value="users">Find Users</TabsTrigger>
              </TabsList>

              <TabsContent value="conversations" className="space-y-4">
                {loading ? (
                  <p className="text-muted-foreground text-center py-8">Loading conversations...</p>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No conversations yet. Start chatting with other learners!</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <Card
                      key={conv.id}
                      className="cursor-pointer hover:bg-accent transition-colors"
                      onClick={() => navigate(`/chat/${conv.id}`)}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={conv.other_user.avatar_url || undefined} />
                          <AvatarFallback>
                            {conv.other_user.display_name?.charAt(0).toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{conv.other_user.display_name}</h3>
                          {conv.last_message && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.last_message.content}
                            </p>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {conv.last_message && new Date(conv.last_message.created_at).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {filteredUsers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No users found</p>
                ) : (
                  <div className="grid gap-4">
                    {filteredUsers.map((user) => (
                      <Card key={user.user_id}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={user.avatar_url || undefined} />
                              <AvatarFallback>
                                {user.display_name?.charAt(0).toUpperCase() || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold">{user.display_name || 'Anonymous'}</h3>
                          </div>
                          <Button onClick={() => startConversation(user.user_id)}>
                            Start Chat
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
