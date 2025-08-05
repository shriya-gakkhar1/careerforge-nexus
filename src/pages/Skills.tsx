import { useState, useEffect } from "react";
import { NavBar } from "@/components/ui/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { getSkillGaps, generateRecommendations, SkillGap } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  RefreshCw,
  ExternalLink,
  CheckCircle,
  Clock,
  Star,
  Loader2,
  Award,
  Zap
} from "lucide-react";

export default function Skills() {
  const { user, profile } = useAuth();
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadSkillGaps();
  }, [user]);

  const loadSkillGaps = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await getSkillGaps(user.id);
      setSkillGaps(data);
      
      // If no skill gaps, generate analysis
      if (data.length === 0) {
        await handleGenerateAnalysis();
      }
    } catch (error) {
      console.error('Error loading skill gaps:', error);
      toast.error('Failed to load skill analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!user) return;
    
    try {
      setGenerating(true);
      await generateRecommendations(user.id, 'skills');
      await loadSkillGaps();
      toast.success('Skill analysis updated!');
    } catch (error) {
      console.error('Error generating analysis:', error);
      toast.error('Failed to generate skill analysis');
    } finally {
      setGenerating(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/20 text-red-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
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
              Skill <span className="text-primary">Analysis</span>
            </h1>
            <p className="text-muted-foreground">
              Track your progress and identify skill gaps for your target roles
            </p>
          </div>
          
          <Button
            onClick={handleGenerateAnalysis}
            disabled={generating}
            className="nexus-gradient"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Analysis
              </>
            )}
          </Button>
        </div>

        {/* Current Skills Overview */}
        {profile?.user_skills && (
          <Card className="mb-8 border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Your Current Skills
              </CardTitle>
              <CardDescription>
                Skills you've added to your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.user_skills.map((skill) => (
                  <div key={skill.id} className="p-4 rounded-lg bg-nexus-surface/50 border border-border/40">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.skill_name}</span>
                      <Badge variant="secondary">{skill.skill_level}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {skill.years_experience} year{skill.years_experience !== 1 ? 's' : ''} experience
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skill Gap Analysis */}
        <div className="grid gap-6">
          {skillGaps.map((gap) => (
            <Card key={gap.id} className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {gap.target_role}
                      {gap.target_company && (
                        <span className="text-muted-foreground">at {gap.target_company}</span>
                      )}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        Current Match: <span className={`font-semibold ${getProgressColor(gap.current_match_percentage)}`}>
                          {gap.current_match_percentage}%
                        </span>
                      </span>
                      <span className="text-sm">
                        {gap.missing_skills.length} skills to improve
                      </span>
                    </CardDescription>
                  </div>
                  
                  <div className="text-right">
                    <Progress value={gap.current_match_percentage} className="w-32 mb-2" />
                    <Badge className={getProgressColor(gap.current_match_percentage)}>
                      {gap.current_match_percentage}% Ready
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Missing Skills */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    Skills to Develop
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {gap.missing_skills.map((skill) => (
                      <div key={skill} className="p-3 rounded-lg bg-nexus-surface/30 border border-border/40">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill}</span>
                          <Badge className={getPriorityColor('high')}>
                            High Priority
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            4-6 weeks
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            High Impact
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Path */}
                {gap.learning_path && Array.isArray(gap.learning_path) && gap.learning_path.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-primary" />
                      Recommended Learning Path
                    </h4>
                    <div className="space-y-3">
                      {gap.learning_path.slice(0, 3).map((item: any, index: number) => (
                        <div key={index} className="p-4 rounded-lg bg-nexus-surface/30 border border-border/40">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium">{item.skill || item.title}</h5>
                              <p className="text-sm text-muted-foreground">
                                Estimated: {item.estimatedWeeks || item.duration || '4'} weeks
                              </p>
                            </div>
                            <Badge className={getPriorityColor(item.priority || 'medium')}>
                              {item.priority || 'Medium'} Priority
                            </Badge>
                          </div>
                          
                          {item.resources && item.resources.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {item.resources.slice(0, 2).map((resource: any, resourceIndex: number) => (
                                <Button
                                  key={resourceIndex}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(resource.url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  {resource.title}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border/40">
                  <Button className="nexus-gradient">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Start Learning Plan
                  </Button>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Resources
                  </Button>
                  <Button variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Update Target Role
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {skillGaps.length === 0 && !loading && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No skill analysis yet</h3>
              <p className="text-muted-foreground mb-4">
                Let our AI analyze your skills and provide personalized recommendations
              </p>
              <Button onClick={handleGenerateAnalysis} className="nexus-gradient">
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Analysis
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}