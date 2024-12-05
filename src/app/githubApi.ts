"use server";

import { Octokit } from "octokit";

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
