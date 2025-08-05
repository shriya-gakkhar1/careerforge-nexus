import { useState } from "react";
import { NavBar } from "@/components/ui/nav-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  TrendingUp, 
  Lightbulb, 
  Bell, 
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Users,
  Target,
  Zap,
  ArrowRight,
  BookOpen,
  Award,
  Clock
} from "lucide-react";

export default function Dashboard() {
  const [user] = useState({
    name: "Priya Sharma",
    email: "priya@iitdelhi.ac.in",
    avatar: "",
    college: "IIT Delhi",
    branch: "Computer Science Engineering",
    year: "3rd Year",
    skills: ["Python", "React", "Node.js", "Git", "MySQL"],
    targetRole: "Software Development Engineer"
  });

  const recentOpportunities = [
    {
      id: 1,
      title: "Software Engineering Intern",
      company: "Google",
      location: "Bangalore",
      type: "Summer Internship",
      match: 92,
      deadline: "15 Feb 2024",
      skills: ["Python", "Data Structures", "System Design"],
      isFeatured: true
    },
    {
      id: 2,
      title: "Frontend Developer Intern",
      company: "Microsoft",
      location: "Hyderabad",
      type: "6 Month Internship",
      match: 88,
      deadline: "20 Feb 2024",
      skills: ["React", "TypeScript", "Azure"],
      isFeatured: false
    },
    {
      id: 3,
      title: "Full Stack Intern",
      company: "Flipkart",
      location: "Bangalore",
      type: "Summer Internship",
      match: 85,
      deadline: "25 Feb 2024",
      skills: ["Node.js", "React", "MongoDB"],
      isFeatured: false
    }
  ];

  const skillGaps = [
    {
      role: "SDE at Google",
      missingSkills: ["System Design", "Docker", "Kubernetes"],
      progress: 65,
      priority: "High"
    },
    {
      role: "Frontend at Microsoft",
      missingSkills: ["TypeScript", "Azure"],
      progress: 80,
      priority: "Medium"
    }
  ];

  const projectSuggestions = [
    {
      title: "Real-time Chat Application",
      description: "Build a scalable chat app with WebSocket, React, and Node.js",
      difficulty: "Intermediate",
      duration: "2-3 weeks",
      skills: ["React", "Node.js", "Socket.io", "MongoDB"],
      impact: "High"
    },
    {
      title: "AI Resume Analyzer",
      description: "Create an AI tool that analyzes resumes and suggests improvements",
      difficulty: "Advanced",
      duration: "3-4 weeks",
      skills: ["Python", "NLP", "Flask", "Machine Learning"],
      impact: "Very High"
    }
  ];

  const stats = [
    { label: "Applications Sent", value: "12", change: "+3 this week" },
    { label: "Profile Views", value: "48", change: "+12 this week" },
    { label: "Skill Score", value: "85%", change: "+5% this month" },
    { label: "Projects", value: "4", change: "2 in progress" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, <span className="text-primary">{user.name.split(' ')[0]}</span>! 👋
              </h1>
              <p className="text-muted-foreground">
                {user.year} • {user.branch} • {user.college}
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              3 New Alerts
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-nexus-success">{stat.change}</p>
                  </div>
                  <div className="h-10 w-10 bg-nexus-surface rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Opportunities */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Latest Opportunities
                    </CardTitle>
                    <CardDescription>
                      Handpicked internships matching your profile
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOpportunities.map((opportunity) => (
                  <div 
                    key={opportunity.id} 
                    className="p-4 rounded-lg border border-border/40 bg-nexus-surface/30 hover:bg-nexus-surface/50 nexus-transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{opportunity.title}</h3>
                          {opportunity.isFeatured && (
                            <Badge className="bg-nexus-accent text-white">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {opportunity.company} • {opportunity.location}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Due: {opportunity.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {opportunity.type}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold text-primary">{opportunity.match}% match</span>
                        </div>
                        <Button size="sm" className="nexus-gradient">
                          Apply Now
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opportunity.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Project Suggestions */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Recommended Projects
                </CardTitle>
                <CardDescription>
                  Portfolio projects tailored to your skills and target roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {projectSuggestions.map((project, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/40 bg-nexus-surface/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-xs">
                          <Badge variant="outline">{project.difficulty}</Badge>
                          <span className="text-muted-foreground">{project.duration}</span>
                          <Badge className={
                            project.impact === "Very High" ? "bg-nexus-success" : "bg-nexus-info"
                          }>
                            {project.impact} Impact
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        Start Project
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skill Gap Analysis */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Skill Analysis
                </CardTitle>
                <CardDescription>
                  Track your progress toward target roles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{gap.role}</span>
                      <Badge variant={gap.priority === "High" ? "destructive" : "secondary"}>
                        {gap.priority}
                      </Badge>
                    </div>
                    <Progress value={gap.progress} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Missing: {gap.missingSkills.join(", ")}
                    </div>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Learning Path
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="h-4 w-4 mr-2" />
                  Find New Internships
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Update Profile
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Award className="h-4 w-4 mr-2" />
                  Take Skill Assessment
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Schedule Mock Interview
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Digest */}
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm nexus-border-glow">
              <CardHeader>
                <CardTitle className="text-center">🔥 This Week's Highlights</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-3">
                <div className="text-2xl font-bold text-primary">15</div>
                <p className="text-sm text-muted-foreground">
                  New opportunities from your dream companies
                </p>
                <Button size="sm" className="nexus-gradient w-full">
                  View Weekly Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}