import {
  getRepos,
  getCreatedModifiedThisYear,
  getCreatedModifiedLastYear,
} from "@/app/githubApi";
import { Repo } from "@/types/repo";
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

    const results = await getRepos(username);

    const repos: Repo[] = results.map((repo: any) => ({
      name: repo.name,
      url: repo.html_url,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
    }));

    console.log("Fetching created and modified last year");

    const { created, modified } = await getCreatedModifiedLastYear(repos);

    console.log("Created last year:", created);
    console.log("Modified last year:", modified);

    const response = {
      createdLastYear: created,
      modifiedLastYear: modified,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch user: ${error}` },
      { status: 500 },
    );
  }
}
