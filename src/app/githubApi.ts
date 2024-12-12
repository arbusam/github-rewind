"use server";

import { Octokit } from "octokit";
import { User } from "@/types/user";
import { Repo } from "@/types/repo";
import { createAppAuth } from "@octokit/auth-app";

const octokit = new Octokit({
  authStrategy: createAppAuth,
  auth: {
    appId: process.env.GITHUB_APP_ID,
    privateKey: process.env.GITHUB_PRIVATE_KEY,
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    installationId: process.env.GITHUB_INSTALLATION_ID,
  },
});

export async function getUser(username: string) {
  const request = octokit.request("GET /users/{username}", {
    username: username,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const response = (await request).data;
  // console.log(response);
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
  console.log(response);
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

export async function getCommits(username: string) {
  const request = octokit.request("GET /search/commits?q=author:{username}+committer-date:2024-01-01..2024-12-31", {
    username: username,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const response = (await request).data;
  console.log(response);
  console.log(response.incomplete_results);
  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }
  return response.total_count;
}