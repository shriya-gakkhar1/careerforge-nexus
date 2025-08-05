import { useState, useEffect } from "react";
import { NavBar } from "@/components/ui/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { getProjectRecommendations, generateRecommendations, ProjectRecommendation } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Lightbulb, 
  Code, 
  Clock, 
  Target, 
  ExternalLink,
  CheckCircle,
  Play,
  RefreshCw,
  Loader2,
  Star,
  TrendingUp,
  Award
} from "lucide-react";

export default function Projects() {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getProjectRecommendations(user.id);
      setProjects(data);
      
      // If no projects, generate some
      if (data.length === 0) {
        await handleGenerateNew();
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast.error('Failed to load project recommendations');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNew = async () => {
    if (!user) return;
    
    try {
      setGenerating(true);
      await generateRecommendations(user.id, 'projects');
      await loadProjects();
      toast.success('New project recommendations generated!');
    } catch (error) {
      console.error('Error generating projects:', error);
      toast.error('Failed to generate new recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const handleStartProject = (project: ProjectRecommendation) => {
    // In a real app, this would create a project workspace or open a tutorial
    toast.success(`Starting project: ${project.title}`);
    
    // Open GitHub template if available
    if (project.github_template_url) {
      window.open(project.github_template_url, '_blank');
    }
  };

  const markAsCompleted = async (projectId: string) => {
    // In a real app, this would update the database
    setProjects(prev => prev.map(p => 
      p.id === projectId ? { ...p, is_completed: true } : p
    ));
    toast.success('Project marked as completed! 🎉');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  const getImpactColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-blue-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar user={profile ? {
          name: profile.full_name,
          email: user?.email || '',
          avatar: ''
        } : undefined} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar user={profile ? {
        name: profile.full_name,
        email: user?.email || '',
        avatar: ''
      } : undefined} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Project <span className="text-primary">Recommendations</span>
            </h1>
            <p className="text-muted-foreground">
              AI-curated projects to enhance your portfolio and skills
            </p>
          </div>
          
          <Button
            onClick={handleGenerateNew}
            disabled={generating}
            className="nexus-gradient"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate New
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                  <p className="text-2xl font-bold">{projects.length}</p>
                </div>
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{projects.filter(p => p.is_completed).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-nexus-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{projects.filter(p => !p.is_completed).length}</p>
                </div>
                <Code className="h-8 w-8 text-nexus-warning" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Impact</p>
                  <p className="text-2xl font-bold">
                    {Math.round(projects.reduce((acc, p) => acc + p.impact_score, 0) / projects.length) || 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-nexus-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/40 nexus-transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2 flex items-center gap-2">
                      {project.is_completed ? (
                        <CheckCircle className="h-5 w-5 text-nexus-success" />
                      ) : (
                        <Code className="h-5 w-5 text-primary" />
                      )}
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {project.description}
                    </CardDescription>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <Badge className={getDifficultyColor(project.difficulty)}>
                      {project.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className={`text-sm font-semibold ${getImpactColor(project.impact_score)}`}>
                        {project.impact_score}% Impact
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Duration & Status */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {project.estimated_duration}
                  </span>
                  {project.is_completed ? (
                    <Badge className="bg-nexus-success/20 text-nexus-success">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      In Progress
                    </Badge>
                  )}
                </div>

                {/* Tech Stack */}
                <div>
                  <p className="text-sm font-medium mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div>
                  <p className="text-sm font-medium mb-2">What You'll Learn</p>
                  <ul className="space-y-1">
                    {project.learning_outcomes.slice(0, 3).map((outcome, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <Target className="h-3 w-3 mt-1 text-primary flex-shrink-0" />
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress */}
                {!project.is_completed && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {project.is_completed ? (
                    <Button variant="outline" className="flex-1" disabled>
                      <Award className="h-4 w-4 mr-2" />
                      Completed
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleStartProject(project)}
                        className="flex-1 nexus-gradient"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Project
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => markAsCompleted(project.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  {project.tutorial_links && project.tutorial_links.length > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(project.tutorial_links![0], '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {projects.length === 0 && !loading && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No project recommendations yet</h3>
              <p className="text-muted-foreground mb-4">
                Let our AI analyze your profile and generate personalized project ideas
              </p>
              <Button onClick={handleGenerateNew} className="nexus-gradient">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Recommendations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}