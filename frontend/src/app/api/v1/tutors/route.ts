import { NextResponse } from "next/server";
import { fetchLiveTutorsFromSheets } from "@/backend/csv_sync";
import { TutorService } from "@/backend/services/tutor.service";

export async function GET() {
  try {
    const localTutors = TutorService.getAllTutors();
    const tutors = await fetchLiveTutorsFromSheets(localTutors);

    const tagSet = new Set<string>();
    for (const t of tutors) {
      for (const tag of t.subjectTags) {
        tagSet.add(tag);
      }
    }
    const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b, "es"));

    return NextResponse.json({ tutors, tags });
  } catch (error) {
    console.error("Error fetching tutors:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutors" },
      { status: 500 },
    );
  }
}
