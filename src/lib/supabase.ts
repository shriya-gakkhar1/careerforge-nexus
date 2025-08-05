import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  full_name: string
  college: string
  branch: string
  year: string
  location?: string
  bio?: string
  resume_url?: string
  portfolio_url?: string
  linkedin_url?: string
  github_url?: string
  target_role?: string
  preferred_locations?: string[]
  dream_companies?: string[]
  created_at: string
  updated_at: string
}

export interface UserSkill {
  id: string
  user_id: string
  skill_name: string
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  years_experience: number
  is_verified: boolean
  created_at: string
}

export interface Internship {
  id: string
  title: string
  company_name: string
  company_logo_url?: string
  location: string
  type: string
  description: string
  requirements: string[]
  skills_required: string[]
  min_cgpa?: number
  salary_min?: number
  salary_max?: number
  application_deadline?: string
  external_url: string
  source: string
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  match_score?: number
}

export interface Application {
  id: string
  user_id: string
  internship_id: string
  status: 'Applied' | 'Under Review' | 'Interview' | 'Rejected' | 'Accepted'
  applied_date: string
  notes?: string
  match_score?: number
}

export interface ProjectRecommendation {
  id: string
  user_id: string
  title: string
  description: string
  difficulty: string
  estimated_duration: string
  tech_stack: string[]
  learning_outcomes: string[]
  impact_score: number
  github_template_url?: string
  tutorial_links?: string[]
  is_completed: boolean
  created_at: string
}

export interface SkillGap {
  id: string
  user_id: string
  target_role: string
  target_company?: string
  missing_skills: string[]
  current_match_percentage: number
  learning_path: any
  created_at: string
  updated_at: string
}

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session?.user
}

export const signUp = async (email: string, password: string, profile: Partial<Profile>) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: profile
    }
  })
  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Database helpers
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_skills (*)
    `)
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export const getInternships = async (limit = 20, filters?: any) => {
  let query = supabase
    .from('internships')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (filters?.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters?.company) {
    query = query.ilike('company_name', `%${filters.company}%`)
  }
  if (filters?.skills) {
    query = query.overlaps('skills_required', filters.skills)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export const applyToInternship = async (userId: string, internshipId: string, matchScore?: number) => {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      user_id: userId,
      internship_id: internshipId,
      match_score: matchScore
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const getUserApplications = async (userId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select(`
      *,
      internships (*)
    `)
    .eq('user_id', userId)
    .order('applied_date', { ascending: false })

  if (error) throw error
  return data
}

export const getProjectRecommendations = async (userId: string) => {
  const { data, error } = await supabase
    .from('project_recommendations')
    .select('*')
    .eq('user_id', userId)
    .order('impact_score', { ascending: false })

  if (error) throw error
  return data
}

export const getSkillGaps = async (userId: string) => {
  const { data, error } = await supabase
    .from('skill_gaps')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const generateRecommendations = async (userId: string, type: 'internships' | 'projects' | 'skills') => {
  const { data, error } = await supabase.functions.invoke('generate-recommendations', {
    body: { userId, type }
  })

  if (error) throw error
  return data
}

export const scrapeInternships = async () => {
  const { data, error } = await supabase.functions.invoke('scrape-internships')
  if (error) throw error
  return data
}