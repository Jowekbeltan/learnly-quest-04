import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Subject from "./pages/Subject";
import Lesson from "./pages/Lesson";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Library from "./pages/Library";
import BookReader from "./pages/BookReader";
import TeacherLesson from "./pages/TeacherLesson";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/ChatRoom";
import NotFound from "./pages/NotFound";
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
            <Route path="/book/:bookId" element={<BookReader />} />
            <Route path="/teacher-lesson/:lessonId" element={<TeacherLesson />} />
            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/chat/:conversationId" element={<ProtectedRoute><ChatRoom /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/subject/:subjectId" element={<ProtectedRoute><Subject /></ProtectedRoute>} />
            <Route path="/lesson/:subjectId/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
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
