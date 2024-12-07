"use server";

import { Octokit } from "octokit";
import { User } from "@/types/user";
import { Repo } from "@/types/repo";

const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});

export async function getUser(username: string) {
  const request = octokit.request("GET /users/{username}", {
    username: username,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const response = (await request).data;
  console.log(response);
  return response;
}

export async function getRepos(username: string) {
  const request = octokit.request("GET /users/{username}/repos", {
    username: username,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const response = (await request).data;
  // console.log(response);
  return response;
}

export async function getCreatedModifiedThisYear(repos: Repo[]) {
  const thisYear = new Date().getFullYear();
  const createdThisYear = repos.filter(
    (repo) => new Date(repo.created_at).getFullYear() === thisYear,
  );
  const modifiedThisYear = repos.filter(
    (repo) => new Date(repo.updated_at).getFullYear() === thisYear,
  );
  return { created: createdThisYear.length, modified: modifiedThisYear.length };
}
