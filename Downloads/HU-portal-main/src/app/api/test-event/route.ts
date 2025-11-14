import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const data = await request.json()
    
    console.log('Test API received data:', data)
    
    // Try to insert the event
    const { data: result, error } = await supabase
      .from('events')
      .insert(data)
      .select()
      .single()
    
    if (error) {
      console.error('Test API error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: error.details,
        hint: error.hint
      }, { status: 400 })
    }
    
    console.log('Test API success:', result)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Test API caught error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}