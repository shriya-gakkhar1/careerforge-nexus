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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Simulate scraping from multiple sources
    const internships = [
      ...await scrapeInternshala(),
      ...await scrapeLinkedIn(),
      ...await scrapeCompanyCareers()
    ]

    // Store in database
    for (const internship of internships) {
      await supabaseClient
        .from('internships')
        .upsert(internship, { onConflict: 'external_url' })
    }

    return new Response(
      JSON.stringify({ message: `Successfully scraped ${internships.length} internships` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

async function scrapeInternshala() {
  // Simulated Internshala data (in real implementation, you'd use web scraping)
  return [
    {
      title: "Machine Learning Intern",
      company_name: "Zomato",
      location: "Gurugram",
      type: "6 Month Internship",
      description: "Work on ML models for food recommendation systems",
      requirements: ["Python programming", "Machine Learning basics", "Statistics knowledge"],
      skills_required: ["Python", "TensorFlow", "Pandas", "NumPy"],
      salary_min: 15000,
      salary_max: 25000,
      application_deadline: "2024-03-15",
      external_url: "https://internshala.com/internship/detail/machine-learning-internship-in-gurugram-at-zomato",
      source: "Internshala",
      is_featured: false
    },
    {
      title: "Android Developer Intern",
      company_name: "Paytm",
      location: "Noida",
      type: "Summer Internship",
      description: "Develop features for Paytm mobile applications",
      requirements: ["Android development experience", "Java/Kotlin knowledge", "UI/UX understanding"],
      skills_required: ["Android", "Java", "Kotlin", "XML"],
      salary_min: 20000,
      salary_max: 30000,
      application_deadline: "2024-03-20",
      external_url: "https://internshala.com/internship/detail/android-developer-internship-in-noida-at-paytm",
      source: "Internshala",
      is_featured: true
    }
  ]
}

async function scrapeLinkedIn() {
  // Simulated LinkedIn data
  return [
    {
      title: "Data Science Intern",
      company_name: "Swiggy",
      location: "Bangalore",
      type: "Summer Internship",
      description: "Analyze user behavior data and build predictive models",
      requirements: ["Data Science background", "Python programming", "SQL knowledge"],
      skills_required: ["Python", "SQL", "Machine Learning", "Statistics"],
      salary_min: 25000,
      salary_max: 35000,
      application_deadline: "2024-03-25",
      external_url: "https://linkedin.com/jobs/swiggy-data-science-intern",
      source: "LinkedIn",
      is_featured: true
    },
    {
      title: "DevOps Intern",
      company_name: "Razorpay",
      location: "Bangalore",
      type: "6 Month Internship",
      description: "Work on infrastructure automation and deployment pipelines",
      requirements: ["Linux knowledge", "Scripting experience", "Cloud platform familiarity"],
      skills_required: ["Linux", "Docker", "Kubernetes", "AWS", "Python"],
      salary_min: 30000,
      salary_max: 40000,
      application_deadline: "2024-04-01",
      external_url: "https://linkedin.com/jobs/razorpay-devops-intern",
      source: "LinkedIn",
      is_featured: false
    }
  ]
}

async function scrapeCompanyCareers() {
  // Simulated company career page data
  return [
    {
      title: "Product Management Intern",
      company_name: "Ola",
      location: "Bangalore",
      type: "Summer Internship",
      description: "Work with product teams to define and execute product roadmaps",
      requirements: ["Business acumen", "Analytical thinking", "Communication skills"],
      skills_required: ["Product Management", "Analytics", "SQL", "Excel"],
      salary_min: 35000,
      salary_max: 45000,
      application_deadline: "2024-04-05",
      external_url: "https://careers.ola.com/product-management-intern",
      source: "Ola Careers",
      is_featured: true
    },
    {
      title: "UI/UX Design Intern",
      company_name: "Myntra",
      location: "Bangalore",
      type: "4 Month Internship",
      description: "Design user interfaces and experiences for fashion e-commerce",
      requirements: ["Design portfolio", "Figma/Sketch proficiency", "User research experience"],
      skills_required: ["Figma", "Sketch", "User Research", "Prototyping"],
      salary_min: 20000,
      salary_max: 30000,
      application_deadline: "2024-04-10",
      external_url: "https://careers.myntra.com/ui-ux-design-intern",
      source: "Myntra Careers",
      is_featured: false
    }
  ]
}