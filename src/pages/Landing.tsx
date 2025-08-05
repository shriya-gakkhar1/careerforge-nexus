import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Users, 
  Zap,
  ArrowRight,
  Star,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Search,
      title: "Smart Internship Finder",
      description: "AI-powered matching with real-time opportunities from top companies and startups.",
      badge: "Live Data"
    },
    {
      icon: TrendingUp,
      title: "Skill Gap Analyzer",
      description: "Compare your profile to dream roles and get personalized learning roadmaps.",
      badge: "AI Powered"
    },
    {
      icon: Lightbulb,
      title: "Project Recommender",
      description: "Get unique, branch-specific project ideas that make your portfolio stand out.",
      badge: "Personalized"
    },
    {
      icon: Target,
      title: "Career Roadmaps",
      description: "Clear, actionable paths from your current skills to target roles at FAANG+ companies.",
      badge: "Expert Curated"
    }
  ];

  const stats = [
    { value: "5000+", label: "Active Opportunities" },
    { value: "200+", label: "Partner Companies" },
    { value: "98%", label: "Placement Success" },
    { value: "24h", label: "Response Time" }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CSE, IIT Delhi",
      company: "Google SWE Intern",
      content: "Project Nexus helped me identify exactly what skills I was missing for Google. Got my offer in 3 months!",
      rating: 5
    },
    {
      name: "Rahul Kumar",
      role: "ECE, BITS Pilani",
      company: "Microsoft PM Intern",
      content: "The project recommendations were game-changing. Built 2 projects that directly led to my Microsoft internship.",
      rating: 5
    },
    {
      name: "Ananya Gupta",
      role: "CSE, NIT Trichy",
      company: "Amazon SDE Intern",
      content: "Weekly alerts kept me updated on new opportunities. Never missed applying to my dream companies again.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg nexus-gradient">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-nexus-accent bg-clip-text text-transparent">
                Project Nexus
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="nexus-gradient hover:opacity-90 nexus-transition">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <Badge className="mb-6 bg-nexus-surface border-primary/20 text-primary">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered Career Intelligence
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-nexus-accent bg-clip-text text-transparent animate-gradient">
              Your AI Career Assistant for
              <span className="block text-primary">Dream Tech Internships</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover relevant internships, analyze skill gaps, and get personalized project recommendations 
              — all tailored to your engineering branch and career goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/signup">
                <Button size="lg" className="nexus-gradient hover:opacity-90 nexus-transition text-lg px-8 py-6 nexus-glow">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/20 hover:border-primary">
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexus-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-nexus-surface/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Land Your
              <span className="text-primary"> Dream Internship</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From discovery to application, we've got every step of your internship journey covered.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/40 nexus-transition group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg nexus-gradient group-hover:nexus-glow nexus-transition">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              From Profile to <span className="text-primary">Placement</span> in 3 Steps
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple, AI-powered process that gets you results fast
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Complete Your Profile",
                description: "Tell us about your branch, skills, interests, and target companies. Takes just 2 minutes.",
                icon: Users
              },
              {
                step: "02", 
                title: "Get AI Recommendations",
                description: "Our AI analyzes thousands of opportunities and creates personalized recommendations just for you.",
                icon: Zap
              },
              {
                step: "03",
                title: "Apply & Track Progress",
                description: "Apply directly through our platform and track your progress with real-time updates.",
                icon: Target
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mx-auto mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full nexus-gradient mx-auto nexus-glow">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-nexus-accent text-white text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-nexus-surface/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories from <span className="text-primary">Top Colleges</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of engineering students who landed their dream internships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base italic">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full nexus-gradient">
                      <span className="text-sm font-semibold text-white">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {testimonial.company}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Launch Your <span className="text-primary">Tech Career</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join Project Nexus today and get your first personalized internship recommendations in under 60 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="nexus-gradient hover:opacity-90 nexus-transition text-lg px-8 py-6 nexus-glow">
                  Start Free Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-nexus-success" />
                Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-nexus-success" />
                No Credit Card
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-nexus-success" />
                2 Min Setup
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-nexus-surface/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg nexus-gradient">
                <span className="text-sm font-bold text-white">N</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-nexus-accent bg-clip-text text-transparent">
                Project Nexus
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary nexus-transition">Privacy Policy</a>
              <a href="#" className="hover:text-primary nexus-transition">Terms of Service</a>
              <a href="#" className="hover:text-primary nexus-transition">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            © 2024 Project Nexus. Made with ❤️ for engineering students.
          </div>
        </div>
      </footer>
    </div>
  );
}