import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Subject from "./pages/Subject";
import Lesson from "./pages/Lesson";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Library from "./pages/Library";
import BookReader from "./pages/BookReader";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import Notifications from "./pages/Notifications";
import TeacherContent from "./pages/TeacherContent";
import TeacherLesson from "./pages/TeacherLesson";
import Videos from "./pages/Videos";
import Downloads from "./pages/Downloads";
import Leaderboard from "./pages/Leaderboard";
import FloatingChatButton from "@/components/FloatingChatButton";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/library" element={<Library />} />
            <Route path="/teacher-content" element={<ProtectedRoute><TeacherContent /></ProtectedRoute>} />
            <Route path="/book/:bookId" element={<BookReader />} />
            <Route path="/teacher-lesson/:lessonId" element={<TeacherLesson />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/subject/:subjectId" element={<ProtectedRoute><Subject /></ProtectedRoute>} />
            <Route path="/lesson/:subjectId/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
            <Route path="/videos" element={<ProtectedRoute><Videos /></ProtectedRoute>} />
            <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingChatButton />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
