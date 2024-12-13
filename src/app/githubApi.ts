"use server";

import { Octokit } from "octokit";
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
  const request = octokit.request(
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
  const request = octokit.request(
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
  const request = octokit.request(
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
  const request = octokit.request(
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
  const request = octokit.request(
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
  const request = octokit.request(
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