import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { userId, type } = await req.json()

    // Get user profile and skills
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*, user_skills(*)')
      .eq('id', userId)
      .single()

    if (!profile) {
      throw new Error('Profile not found')
    }

    let recommendations = []

    if (type === 'internships') {
      recommendations = await generateInternshipRecommendations(supabaseClient, profile)
    } else if (type === 'projects') {
      recommendations = await generateProjectRecommendations(supabaseClient, profile)
    } else if (type === 'skills') {
      recommendations = await generateSkillRecommendations(supabaseClient, profile)
    }

    return new Response(
      JSON.stringify({ recommendations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function generateInternshipRecommendations(supabaseClient: any, profile: any) {
  const userSkills = profile.user_skills.map((s: any) => s.skill_name.toLowerCase())
  
  // Get all active internships
  const { data: internships } = await supabaseClient
    .from('internships')
    .select('*')
    .eq('is_active', true)

  // Calculate match scores and sort
  const scoredInternships = internships.map((internship: any) => {
    const requiredSkills = internship.skills_required.map((s: string) => s.toLowerCase())
    const matchingSkills = requiredSkills.filter(skill => 
      userSkills.some(userSkill => userSkill.includes(skill) || skill.includes(userSkill))
    )
    const matchScore = Math.round((matchingSkills.length / requiredSkills.length) * 100)
    
    return {
      ...internship,
      match_score: matchScore,
      matching_skills: matchingSkills
    }
  })

  return scoredInternships
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, 20)
}

async function generateProjectRecommendations(supabaseClient: any, profile: any) {
  const userSkills = profile.user_skills.map((s: any) => s.skill_name)
  const branch = profile.branch
  
  // AI-generated project ideas based on skills and branch
  const projectTemplates = [
    {
      title: "Real-time Chat Application",
      description: "Build a scalable chat application with real-time messaging, user authentication, and file sharing capabilities",
      difficulty: "Intermediate",
      estimated_duration: "3-4 weeks",
      tech_stack: ["React", "Node.js", "Socket.io", "MongoDB", "JWT"],
      learning_outcomes: ["WebSocket programming", "Real-time communication", "User authentication", "Database design"],
      impact_score: 85,
      suitable_for: ["Computer Science Engineering", "Information Technology"]
    },
    {
      title: "AI-Powered Resume Analyzer",
      description: "Create an intelligent system that analyzes resumes and provides improvement suggestions using NLP",
      difficulty: "Advanced", 
      estimated_duration: "4-6 weeks",
      tech_stack: ["Python", "Flask", "NLP", "OpenAI API", "React", "PostgreSQL"],
      learning_outcomes: ["Natural Language Processing", "API integration", "Machine Learning", "Full-stack development"],
      impact_score: 95,
      suitable_for: ["Computer Science Engineering", "Information Technology"]
    },
    {
      title: "IoT Home Automation System",
      description: "Design and build a smart home system with sensor monitoring and remote control capabilities",
      difficulty: "Advanced",
      estimated_duration: "6-8 weeks", 
      tech_stack: ["Arduino", "Raspberry Pi", "Node.js", "React", "MQTT", "MySQL"],
      learning_outcomes: ["IoT protocols", "Embedded systems", "Sensor integration", "Real-time monitoring"],
      impact_score: 90,
      suitable_for: ["Electronics and Communication", "Electrical Engineering", "Computer Science Engineering"]
    },
    {
      title: "E-commerce Platform with Microservices",
      description: "Build a complete e-commerce solution using microservices architecture",
      difficulty: "Advanced",
      estimated_duration: "8-10 weeks",
      tech_stack: ["Node.js", "React", "Docker", "Kubernetes", "MongoDB", "Redis"],
      learning_outcomes: ["Microservices architecture", "Containerization", "Scalable systems", "Payment integration"],
      impact_score: 95,
      suitable_for: ["Computer Science Engineering", "Information Technology"]
    }
  ]

  // Filter projects suitable for user's branch and skills
  const suitableProjects = projectTemplates.filter(project => 
    project.suitable_for.includes(branch)
  )

  // Calculate relevance score based on user skills
  const scoredProjects = suitableProjects.map(project => {
    const matchingSkills = project.tech_stack.filter(skill =>
      userSkills.some((userSkill: string) => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) || 
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    )
    const skillMatchScore = (matchingSkills.length / project.tech_stack.length) * 100
    
    return {
      ...project,
      skill_match_score: Math.round(skillMatchScore),
      matching_skills: matchingSkills
    }
  })

  // Store recommendations in database
  for (const project of scoredProjects.slice(0, 3)) {
    await supabaseClient
      .from('project_recommendations')
      .upsert({
        user_id: profile.id,
        title: project.title,
        description: project.description,
        difficulty: project.difficulty,
        estimated_duration: project.estimated_duration,
        tech_stack: project.tech_stack,
        learning_outcomes: project.learning_outcomes,
        impact_score: project.impact_score
      })
  }

  return scoredProjects.slice(0, 3)
}

async function generateSkillRecommendations(supabaseClient: any, profile: any) {
  const userSkills = profile.user_skills.map((s: any) => s.skill_name.toLowerCase())
  const targetRole = profile.target_role || 'Software Developer'
  
  // Define skill requirements for different roles
  const roleSkillMap: { [key: string]: string[] } = {
    'software developer': ['JavaScript', 'Python', 'React', 'Node.js', 'Git', 'SQL', 'Data Structures', 'Algorithms'],
    'data scientist': ['Python', 'R', 'Machine Learning', 'Statistics', 'SQL', 'Pandas', 'NumPy', 'Jupyter'],
    'frontend developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'TypeScript', 'Sass', 'Webpack'],
    'backend developer': ['Node.js', 'Python', 'Java', 'Express', 'MongoDB', 'PostgreSQL', 'REST APIs', 'Docker'],
    'full stack developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'REST APIs', 'Docker', 'AWS']
  }

  const requiredSkills = roleSkillMap[targetRole.toLowerCase()] || roleSkillMap['software developer']
  const missingSkills = requiredSkills.filter(skill => 
    !userSkills.some(userSkill => userSkill.includes(skill.toLowerCase()))
  )

  const currentMatchPercentage = Math.round(
    ((requiredSkills.length - missingSkills.length) / requiredSkills.length) * 100
  )

  // Generate learning path
  const learningPath = missingSkills.map(skill => ({
    skill,
    priority: getSkillPriority(skill, targetRole),
    estimatedWeeks: getEstimatedLearningTime(skill),
    resources: getSkillResources(skill)
  }))

  // Store skill gap analysis
  await supabaseClient
    .from('skill_gaps')
    .upsert({
      user_id: profile.id,
      target_role: targetRole,
      missing_skills: missingSkills,
      current_match_percentage: currentMatchPercentage,
      learning_path: learningPath
    })

  return {
    target_role: targetRole,
    current_match_percentage: currentMatchPercentage,
    missing_skills: missingSkills,
    learning_path: learningPath
  }
}

function getSkillPriority(skill: string, role: string): 'High' | 'Medium' | 'Low' {
  const highPrioritySkills = ['JavaScript', 'Python', 'React', 'Git', 'Data Structures', 'Algorithms']
  return highPrioritySkills.includes(skill) ? 'High' : 'Medium'
}

function getEstimatedLearningTime(skill: string): number {
  const timeMap: { [key: string]: number } = {
    'JavaScript': 8,
    'Python': 6,
    'React': 6,
    'Node.js': 4,
    'Git': 2,
    'SQL': 4,
    'Docker': 3,
    'AWS': 8
  }
  return timeMap[skill] || 4
}

function getSkillResources(skill: string) {
  const resourceMap: { [key: string]: any[] } = {
    'JavaScript': [
      { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide' },
      { title: 'JavaScript.info', url: 'https://javascript.info/' }
    ],
    'Python': [
      { title: 'Python.org Tutorial', url: 'https://docs.python.org/3/tutorial/' },
      { title: 'Automate the Boring Stuff', url: 'https://automatetheboringstuff.com/' }
    ],
    'React': [
      { title: 'React Official Docs', url: 'https://react.dev/' },
      { title: 'React Tutorial', url: 'https://react.dev/learn' }
    ]
  }
  return resourceMap[skill] || [{ title: `Learn ${skill}`, url: '#' }]
}