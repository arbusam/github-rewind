import { getPullRequestsMergedLastYear } from "@/app/githubApi";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "No username provided" },
        { status: 400 },
      );
    }

    const results = await getPullRequestsMergedLastYear(username);

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Failed to fetch user: ${error}` },
      { status: 500 },
    );
  }
}
