import { getCreatedModifiedThisYear } from "@/app/githubApi";
import exp from "constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const repos = await req.json();

    if (!repos) {
      return NextResponse.json(
        { error: "No repos provided" },
        { status: 400 },
      );
    }

    const results = await getCreatedModifiedThisYear(repos);
    console.log(results);
    return NextResponse.json({
      created: results.created.length,
      modified: results.modified.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch created and modified repos this year: ${error}` },
      { status: 500 },
    );
  }
}