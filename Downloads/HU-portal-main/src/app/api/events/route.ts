import { NextResponse } from "next/server";

export async function GET() {
  const data = {
    events: [
      {
        id: "00000000-0000-0000-0000-000000000001",
        title: "React Workshop",
        description: "Learn React fundamentals",
        category: "workshop",
        date: "2024-01-15",
        time: "14:00",
        location: "Boston, MA",
        banner_url: "https://storage.example/placeholder.jpg",
        created_by: "organizer_id",
        registration_count: 45,
        max_registrations: 100,
      },
    ],
    total: 1,
    page: 1,
    per_page: 12,
  };
  return NextResponse.json(data);
}