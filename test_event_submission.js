// Simple test script to verify public event submission
const testEventSubmission = async () => {
  const testData = {
    title: 'Test Event',
    description: 'This is a test event submission',
    category: 'technology',
    date: '2024-12-01',
    time: '14:00',
    location: 'Online',
    event_type: 'online',
    max_capacity: 50,
    organizer_name: 'Test Organizer',
    organizer_email: 'test@example.com',
    submission_type: 'public',
    status: 'pending',
    is_published: false
  }

  console.log('Test data:', testData)
  
  try {
    const response = await fetch('/api/test-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })
    
    const result = await response.json()
    console.log('Test result:', result)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

// Uncomment to run test
// testEventSubmission()