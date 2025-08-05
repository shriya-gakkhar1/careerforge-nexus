import { useState, useEffect } from "react";
import { NavBar } from "@/components/ui/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { getInternships, applyToInternship, Internship } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink,
  Star,
  Building,
  Users,
  DollarSign,
  Loader2
} from "lucide-react";

export default function Internships() {
  const { user, profile } = useAuth();
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    loadInternships();
  }, []);

  const loadInternships = async () => {
    try {
      setLoading(true);
      const data = await getInternships(50, {
        location: locationFilter,
        company: companyFilter
      });
      setInternships(data);
    } catch (error) {
      console.error('Error loading internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (internship: Internship) => {
    if (!user) return;
    
    setApplying(internship.id);
    try {
      await applyToInternship(user.id, internship.id, internship.match_score);
      toast.success(`Applied to ${internship.title} at ${internship.company_name}!`);
      
      // Open external application link
      window.open(internship.external_url, '_blank');
    } catch (error: any) {
      if (error.message?.includes('duplicate')) {
        toast.error('You have already applied to this internship');
      } else {
        toast.error('Failed to apply. Please try again.');
      }
    } finally {
      setApplying(null);
    }
  };

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = !locationFilter || internship.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || internship.type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const calculateMatchScore = (internship: Internship) => {
    if (!profile?.user_skills) return 60;
    
    const userSkills = profile.user_skills.map(s => s.skill_name.toLowerCase());
    const requiredSkills = internship.skills_required.map(s => s.toLowerCase());
    const matchingSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    );
    
    return Math.round((matchingSkills.length / requiredSkills.length) * 100);
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Find Your <span className="text-primary">Dream Internship</span>
          </h1>
          <p className="text-muted-foreground">
            Discover opportunities from top companies, tailored to your skills and interests
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search internships..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="Summer Internship">Summer Internship</SelectItem>
                  <SelectItem value="6 Month Internship">6 Month Internship</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={loadInternships}>
                <Filter className="h-4 w-4 mr-2" />
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Found {filteredInternships.length} internships
          </p>
          <Select defaultValue="match">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="salary">Salary</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Internships Grid */}
        <div className="grid gap-6">
          {filteredInternships.map((internship) => {
            const matchScore = calculateMatchScore(internship);
            
            return (
              <Card key={internship.id} className="border-border/40 bg-card/50 backdrop-blur-sm hover:border-primary/40 nexus-transition">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg nexus-gradient">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{internship.title}</h3>
                          <p className="text-muted-foreground">{internship.company_name}</p>
                        </div>
                        {internship.is_featured && (
                          <Badge className="bg-nexus-accent text-white">Featured</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {internship.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {internship.type}
                        </span>
                        {internship.salary_min && (
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            ₹{internship.salary_min.toLocaleString()}-{internship.salary_max?.toLocaleString()}/month
                          </span>
                        )}
                        {internship.application_deadline && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(internship.application_deadline).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {internship.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {internship.skills_required.slice(0, 6).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {internship.skills_required.length > 6 && (
                          <Badge variant="outline" className="text-xs">
                            +{internship.skills_required.length - 6} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-primary">{matchScore}% match</span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={() => handleApply(internship)}
                          disabled={applying === internship.id}
                          className="nexus-gradient w-full"
                        >
                          {applying === internship.id ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            <>
                              Apply Now
                              <ExternalLink className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(internship.external_url, '_blank')}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Source: {internship.source} • Posted: {new Date(internship.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredInternships.length === 0 && !loading && (
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No internships found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or check back later for new opportunities
              </p>
              <Button onClick={loadInternships}>
                Refresh Results
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}