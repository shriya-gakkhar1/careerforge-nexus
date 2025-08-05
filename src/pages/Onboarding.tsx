import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  User, 
  Target, 
  Zap, 
  CheckCircle,
  MapPin,
  Building,
  Code,
  Plus,
  X
} from "lucide-react";

const SKILL_OPTIONS = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", "Angular", "Vue.js",
  "HTML/CSS", "TypeScript", "PHP", "Ruby", "Go", "Rust", "Swift", "Kotlin",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "GraphQL",
  "AWS", "Azure", "Docker", "Kubernetes", "Git", "Linux", "Jenkins",
  "Machine Learning", "Data Science", "TensorFlow", "PyTorch", "Pandas", "NumPy",
  "React Native", "Flutter", "iOS", "Android", "Unity", "Figma", "Adobe XD"
];

const COMPANY_OPTIONS = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla", "SpaceX",
  "Uber", "Airbnb", "Stripe", "Shopify", "Atlassian", "Salesforce", "Adobe",
  "Flipkart", "Zomato", "Paytm", "Swiggy", "Ola", "Myntra", "BigBasket",
  "BYJU'S", "Unacademy", "PhonePe", "Razorpay", "Freshworks", "Zoho"
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    target_role: "",
    bio: "",
    location: "",
    portfolio_url: "",
    linkedin_url: "",
    github_url: "",
    preferred_locations: [] as string[],
    dream_companies: [] as string[],
    skills: [] as { name: string; level: string; experience: number }[]
  });

  const progress = (currentStep / 4) * 100;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = (skillName: string) => {
    if (!formData.skills.find(s => s.name === skillName)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, level: "Intermediate", experience: 1 }]
      }));
    }
  };

  const removeSkill = (skillName: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName)
    }));
  };

  const updateSkill = (skillName: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(s => 
        s.name === skillName ? { ...s, [field]: value } : s
      )
    }));
  };

  const addLocation = (location: string) => {
    if (!formData.preferred_locations.includes(location)) {
      setFormData(prev => ({
        ...prev,
        preferred_locations: [...prev.preferred_locations, location]
      }));
    }
  };

  const removeLocation = (location: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_locations: prev.preferred_locations.filter(l => l !== location)
    }));
  };

  const addCompany = (company: string) => {
    if (!formData.dream_companies.includes(company)) {
      setFormData(prev => ({
        ...prev,
        dream_companies: [...prev.dream_companies, company]
      }));
    }
  };

  const removeCompany = (company: string) => {
    setFormData(prev => ({
      ...prev,
      dream_companies: prev.dream_companies.filter(c => c !== company)
    }));
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update profile
      await updateProfile({
        target_role: formData.target_role,
        bio: formData.bio,
        location: formData.location,
        portfolio_url: formData.portfolio_url,
        linkedin_url: formData.linkedin_url,
        github_url: formData.github_url,
        preferred_locations: formData.preferred_locations,
        dream_companies: formData.dream_companies
      });

      // Add user skills
      for (const skill of formData.skills) {
        await supabase
          .from('user_skills')
          .insert({
            user_id: user.id,
            skill_name: skill.name,
            skill_level: skill.level as any,
            years_experience: skill.experience
          });
      }

      // Generate initial recommendations
      await supabase.functions.invoke('generate-recommendations', {
        body: { userId: user.id, type: 'internships' }
      });

      await supabase.functions.invoke('generate-recommendations', {
        body: { userId: user.id, type: 'projects' }
      });

      await supabase.functions.invoke('generate-recommendations', {
        body: { userId: user.id, type: 'skills' }
      });

      toast.success("Profile setup complete! Welcome to Project Nexus!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast.error("Failed to complete setup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Tell us about yourself</h2>
              <p className="text-muted-foreground">Help us understand your career goals</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target_role">What's your target role?</Label>
                <Input
                  id="target_role"
                  placeholder="e.g., Software Development Engineer"
                  value={formData.target_role}
                  onChange={(e) => handleInputChange("target_role", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Brief bio (optional)</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your interests, projects, or achievements..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Current Location</Label>
                <Input
                  id="location"
                  placeholder="e.g., Delhi, India"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">What are your skills?</h2>
              <p className="text-muted-foreground">Add your technical skills and experience level</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Add Skills</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SKILL_OPTIONS.filter(skill => !formData.skills.find(s => s.name === skill)).slice(0, 15).map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addSkill(skill)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Your Skills</Label>
                {formData.skills.map((skill) => (
                  <div key={skill.name} className="p-3 border rounded-lg bg-nexus-surface/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Level</Label>
                        <Select 
                          value={skill.level} 
                          onValueChange={(value) => updateSkill(skill.name, "level", value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Years</Label>
                        <Input
                          type="number"
                          min="0"
                          max="20"
                          value={skill.experience}
                          onChange={(e) => updateSkill(skill.name, "experience", parseInt(e.target.value) || 0)}
                          className="h-8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Where do you want to work?</h2>
              <p className="text-muted-foreground">Set your location and company preferences</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Preferred Locations</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {["Bangalore", "Hyderabad", "Delhi", "Mumbai", "Pune", "Chennai", "Kolkata", "Gurugram", "Noida"].map((location) => (
                    <Badge
                      key={location}
                      variant={formData.preferred_locations.includes(location) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => 
                        formData.preferred_locations.includes(location) 
                          ? removeLocation(location) 
                          : addLocation(location)
                      }
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Dream Companies</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {COMPANY_OPTIONS.slice(0, 12).map((company) => (
                    <Badge
                      key={company}
                      variant={formData.dream_companies.includes(company) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => 
                        formData.dream_companies.includes(company) 
                          ? removeCompany(company) 
                          : addCompany(company)
                      }
                    >
                      <Building className="h-3 w-3 mr-1" />
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Connect your profiles</h2>
              <p className="text-muted-foreground">Link your professional profiles (optional)</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="portfolio_url">Portfolio Website</Label>
                <Input
                  id="portfolio_url"
                  type="url"
                  placeholder="https://yourportfolio.com"
                  value={formData.portfolio_url}
                  onChange={(e) => handleInputChange("portfolio_url", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                <Input
                  id="linkedin_url"
                  type="url"
                  placeholder="https://linkedin.com/in/yourprofile"
                  value={formData.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="github_url">GitHub Profile</Label>
                <Input
                  id="github_url"
                  type="url"
                  placeholder="https://github.com/yourusername"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange("github_url", e.target.value)}
                />
              </div>
            </div>

            <div className="bg-nexus-surface/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-nexus-success" />
                You're all set!
              </h3>
              <p className="text-sm text-muted-foreground">
                We'll use this information to find the best internship opportunities, 
                recommend relevant projects, and create personalized learning paths for you.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg nexus-gradient">
                  <span className="text-sm font-bold text-white">N</span>
                </div>
                <span className="font-semibold">Project Nexus Setup</span>
              </div>
              <Badge variant="outline">{currentStep} of 4</Badge>
            </div>
            <Progress value={progress} className="mb-4" />
          </CardHeader>

          <CardContent>
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="nexus-gradient"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}