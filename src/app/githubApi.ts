"use server";

import { Octokit } from "octokit";
import { Repo } from "@/types/repo";
import { createAppAuth } from "@octokit/auth-app";

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

let octokit: Octokit | null = null;
function getOctokit() {
  if (octokit) return octokit;

  // Ensure we don't throw during module evaluation (e.g. at build time).
  octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: Number(getRequiredEnv("GITHUB_APP_ID")),
      privateKey: getRequiredEnv("GITHUB_PRIVATE_KEY").replace(/\\n/g, "\n"),
      clientId: getRequiredEnv("GITHUB_CLIENT_ID"),
      clientSecret: getRequiredEnv("GITHUB_CLIENT_SECRET"),
      installationId: Number(getRequiredEnv("GITHUB_INSTALLATION_ID")),
    },
  });

  return octokit;
}

export async function getUser(username: string) {
  const request = getOctokit().request("GET /users/{username}", {
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
  const request = getOctokit().request("GET /users/{username}/repos", {
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

export async function getCreatedLastYear(repos: Repo[]) {
  const lastYear = new Date().getFullYear() - 1;
  const createdLastYear = repos.filter(
    (repo) => new Date(repo.created_at).getFullYear() === lastYear,
  );
  return createdLastYear.length;
}

export async function getCommits(username: string) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;
  const request = getOctokit().request(
    "GET /search/commits?q=author:{username}+committer-date:{startDate}..{endDate}",
    {
      username: username,
      startDate: startDate,
      endDate: endDate,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const response = (await request).data;
  // console.log(response);
  // console.log(response.incomplete_results);
  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }
  return response.total_count;
}

export async function getCommitsLastYear(username: string) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear - 1}-01-01`;
  const endDate = `${currentYear - 1}-12-31`;
  const request = getOctokit().request(
    "GET /search/commits?q=author:{username}+committer-date:{startDate}..{endDate}",
    {
      username: username,
      startDate: startDate,
      endDate: endDate,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const response = (await request).data;

  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }

  return response.total_count;
}

export async function getPullRequestsMerged(username: string) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;
  const request = getOctokit().request(
    "GET /search/issues?q=type:{pr}+author:{username}+is:{merged}+merged:{startDate}..{endDate}",
    {
      username: username,
      startDate: startDate,
      endDate: endDate,
      pr: "pr",
      merged: "merged",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const response = (await request).data;

  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }
  return response.total_count;
}

export async function getPullRequestsMergedLastYear(username: string) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear - 1}-01-01`;
  const endDate = `${currentYear - 1}-12-31`;
  const request = getOctokit().request(
    "GET /search/issues?q=type:{pr}+author:{username}+is:{merged}+merged:{startDate}..{endDate}",
    {
      username: username,
      startDate: startDate,
      endDate: endDate,
      pr: "pr",
      merged: "merged",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const response = (await request).data;

  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }

  return response.total_count;
}

export async function getIssuesOpened(username: string) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear}-01-01`;
  const endDate = `${currentYear}-12-31`;
  const request = getOctokit().request(
    "GET /search/issues?q=author:{username}+is:{issue}+created:{startDate}..{endDate}",
    {
      username: username,
      startDate: startDate,
      endDate: endDate,
      issue: "issue",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const response = (await request).data;

  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }

  return response.total_count;
}

export async function getIssuesOpenedLastYear(username: string) {
  const currentYear = new Date().getFullYear();
  const startDate = `${currentYear - 1}-01-01`;
  const endDate = `${currentYear - 1}-12-31`;
  const request = getOctokit().request(
    "GET /search/issues?q=author:{username}+is:{issue}+created:{startDate}..{endDate}",
    {
      username: username,
      startDate: startDate,
      endDate: endDate,
      issue: "issue",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );
  const response = (await request).data;

  if (response.incomplete_results === true) {
    console.log("Incomplete results");
    return 0;
  }

  return response.total_count;
}