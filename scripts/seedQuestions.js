import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { quizData } from '../src/data/quizData.js'

// Load environment variables from .env
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Make sure .env is set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function seedDatabase() {
  console.log('Starting database seed...')

  for (const [subjectId, data] of Object.entries(quizData)) {
    console.log(`Processing subject: ${data.title}...`)

    // 1. Insert Subject
    const { error: subjectError } = await supabase
      .from('subjects')
      .upsert({
        id: subjectId,
        title: data.title,
        icon: data.icon
      })

    if (subjectError) {
      console.error(`Error inserting subject ${data.title}:`, subjectError.message)
      continue
    }

    // 2. Insert Questions
    const questionsToInsert = data.questions.map(q => ({
      subject_id: subjectId,
      question_text: q.q,
      options: q.opts,
      correct_answer_index: q.ans
    }))

    const { error: questionError } = await supabase
      .from('questions')
      .insert(questionsToInsert)

    if (questionError) {
      console.error(`Error inserting questions for ${data.title}:`, questionError.message)
    } else {
      console.log(`Successfully added ${questionsToInsert.length} questions for ${data.title}`)
    }
  }

  console.log('Database seed complete!')
}

seedDatabase()
