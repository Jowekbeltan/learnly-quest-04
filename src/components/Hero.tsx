import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Users, BookOpen, Trophy } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Hero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-slide-in">
          <div className="space-y-4">
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 border-accent/20">
              🎯 Gamified Learning Experience
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Learn, Compete,{" "}
              <span className="bg-hero-gradient bg-clip-text text-transparent">
                Excel
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Join thousands of students aged 10-18 in our interactive learning portal. 
              Earn points, maintain streaks, and climb the leaderboard while mastering 
              Science, Math, Technology, and more!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-hero-gradient hover:opacity-90 text-lg px-8">
              Start Learning
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="text-2xl font-bold">50K+</p>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-2">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <p className="text-2xl font-bold">1000+</p>
              <p className="text-sm text-muted-foreground">Lessons</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-2">
                <Trophy className="h-6 w-6 text-accent" />
              </div>
              <p className="text-2xl font-bold">98%</p>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </div>
        </div>

        <div className="relative animate-bounce-in">
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover">
            <img 
              src={heroImage} 
              alt="Students learning together with technology" 
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-hero-gradient/10"></div>
          </div>
          
          {/* Floating achievement cards */}
          <div className="absolute -top-4 -left-4 bg-white rounded-xl shadow-card p-4 animate-bounce-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-success-gradient rounded-full flex items-center justify-center">
                <Trophy className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Achievement</p>
                <p className="text-sm font-semibold">Math Master!</p>
              </div>
            </div>
          </div>
          
          <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-card p-4 animate-bounce-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">7</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
                <p className="text-sm font-semibold">Keep it up! 🔥</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;