"use client";

import { useEffect, useState } from "react";
import { User } from "@/types/user";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [createdThisYear, setCreatedThisYear] = useState<number>();
  const [createdLastYear, setCreatedLastYear] = useState<number>();
  const [modifiedThisYear, setModifiedThisYear] = useState<number>();
  const [commitsThisYear, setCommitsThisYear] = useState<number>();
  const [commitsLastYear, setCommitsLastYear] = useState<number>();
  const [pullRequestsMerged, setPullRequestsMerged] = useState<number>();
  const [pullRequestsMergedLastYear, setPullRequestsMergedLastYear] = useState<number>();
  const [issuesOpened, setIssuesOpened] = useState<number>();
  const [issuesOpenedLastYear, setIssuesOpenedLastYear] = useState<number>();

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      document.getElementById("search")?.focus();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    setLoading(true);
    setUser(null);
    setCreatedThisYear(undefined);
    setModifiedThisYear(undefined);
    setCommitsThisYear(undefined);
    setCreatedLastYear(undefined);
    setCommitsLastYear(undefined);
    setPullRequestsMerged(undefined);
    setIssuesOpened(undefined);
    setPullRequestsMergedLastYear(undefined);
    setIssuesOpenedLastYear(undefined);
    e.preventDefault();
    fetch(`/api/user?username=${username}`)
      .then((res) => {
        if (!res.ok) {
          setLoading(false);
          throw new Error("User not found");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        const createdDate = new Date(data.created_at).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );
        const user = {
          username: data.login,
          displayName: data.name,
          avatarUrl: data.avatar_url,
          repos: data.public_repos,
          createdDateString: createdDate,
        };
        setUser(user);
        fetch(`/api/repos?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setCreatedThisYear(data.createdThisYear);
            setModifiedThisYear(data.modifiedThisYear);
          });
        fetch(`/api/reposLastYear?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setCreatedLastYear(data.createdLastYear);
          });
        fetch(`/api/commits?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setCommitsThisYear(data);
          });
        fetch(`/api/commitsLastYear?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setCommitsLastYear(data);
          });
        fetch(`/api/pullRequestsMerged?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setPullRequestsMerged(data);
          });
        fetch(`/api/issuesOpened?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setIssuesOpened(data);
          });
        fetch(`/api/pullRequestsMergedLastYear?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setPullRequestsMergedLastYear(data);
          });
        fetch(`/api/issuesOpenedLastYear?username=${username}`)
          .then((res) => res.json())
          .then((data) => {
            setIssuesOpenedLastYear(data);
          });
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 py-8">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-lg bg-white p-12 shadow-lg dark:bg-black">
              <h1 className="text-3xl font-bold text-center mb-1">
                GitHub Rewind
              </h1>
              <h2 className="text-lg text-center text-gray-500 dark:text-gray-400">
                See how your GitHub stats compare to last year
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
                NOTE: Only public repositories are counted
              </p>
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  id="search"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.trim().replace(/\s+/g, ""))
                  }
                  placeholder="Enter a username"
                  className="flex-1 px-4 py-2 rounded-lg border bg-gray-50 border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  disabled={loading}
                >
                  {loading ? (
                    <div role="status">
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-4 h-4 me-3 text-white animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="#E5E7EB"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="currentColor"
                        />
                      </svg>
                      Searching...
                    </div>
                  ) : (
                    "Search"
                  )}
                </button>
              </form>
              <div className="mt-4" />
              {user && (
                <div>
                  <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="mt-6 flex flex-col items-center pb-12">
                      <img
                        className="w-24 h-24 mb-3 rounded-full shadow-lg"
                        src={user.avatarUrl}
                        alt="Avatar"
                      />
                      <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {user.username}
                      </h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user.displayName}
                      </span>
                    </div>
                    <div className="mt-2 px-4 py-2 bg-gray-100 dark:bg-gray-700">
                      <h3 className="text-lg font-semibold flex items-center">
                        Joined:
                        <p className="font-normal ml-1">
                          {user?.createdDateString}
                        </p>
                      </h3>
                      <h3 className="text-lg font-semibold flex items-center">
                        Repositories:
                        <p className="font-normal ml-1">{user?.repos}</p>
                      </h3>
                    </div>
                  </div>
                  <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 mt-6 rounded-lg p-12">
                    <div className="text-center">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-100 rounded-lg p-6">
                          {createdThisYear !== undefined ? (
                            <div className="flex items-center justify-center">
                              <p className="text-5xl font-bold">
                                {createdThisYear}
                              </p>
                              {createdThisYear !== undefined &&
                                createdLastYear !== undefined && (
                                  <div className="flex items-center -mr-2">
                                    {createdThisYear - createdLastYear > 0 ? (
                                      <div className="flex items-center text-4xl font-bold text-green-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="36px"
                                          viewBox="0 -960 960 960"
                                          width="36px"
                                          fill="#10B981"
                                          className="-mr-2"
                                        >
                                          <path d="m280-400 200-200 200 200H280Z" />
                                        </svg>
                                        {Math.abs(
                                          createdThisYear - createdLastYear,
                                        )}
                                      </div>
                                    ) : createdThisYear - createdLastYear ===
                                      0 ? (
                                      <div className="flex items-center text-4xl font-bold text-gray-500 ml-4">
                                        +0
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-4xl font-bold text-red-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="36px"
                                          viewBox="0 -960 960 960"
                                          width="36px"
                                          fill="#EF4444"
                                          className="-mr-2"
                                        >
                                          <path d="M480-360 280-560h400L480-360Z" />
                                        </svg>
                                        {Math.abs(
                                          createdThisYear - createdLastYear,
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div
                              role="status"
                              className="max-w-sm animate-pulse flex justify-center items-center"
                            >
                              <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            </div>
                          )}
                          <p className="text-gray-600 mt-2">
                            Repos Created this year
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-6">
                          {modifiedThisYear !== undefined ? (
                            <div className="flex items-center justify-center">
                              <p className="text-5xl font-bold -mr-2">
                                {modifiedThisYear}
                              </p>
                            </div>
                          ) : (
                            <div
                              role="status"
                              className="max-w-sm animate-pulse flex justify-center items-center"
                            >
                              <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            </div>
                          )}
                          <p className="text-gray-600">
                            Repos Edited this year
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-6">
                          {commitsThisYear !== undefined ? (
                            <div className="flex items-center justify-center">
                              <p className="text-5xl font-bold">
                                {commitsThisYear}
                              </p>
                              {commitsThisYear !== undefined &&
                                commitsLastYear !== undefined && (
                                  <div className="flex items-center -mr-2">
                                    {commitsThisYear - commitsLastYear > 0 ? (
                                      <div className="flex items-center text-4xl font-bold text-green-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="36px"
                                          viewBox="0 -960 960 960"
                                          width="36px"
                                          fill="#10B981"
                                          className="-mr-2"
                                        >
                                          <path d="m280-400 200-200 200 200H280Z" />
                                        </svg>
                                        {Math.abs(
                                          commitsThisYear - commitsLastYear,
                                        )}
                                      </div>
                                    ) : commitsThisYear - commitsLastYear ===
                                      0 ? (
                                      <div className="flex items-center text-4xl font-bold text-gray-500 ml-2">
                                        +0
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-4xl font-bold text-red-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="36px"
                                          viewBox="0 -960 960 960"
                                          width="36px"
                                          fill="#EF4444"
                                          className="-mr-2"
                                        >
                                          <path d="M480-360 280-560h400L480-360Z" />
                                        </svg>
                                        {Math.abs(
                                          commitsThisYear - commitsLastYear,
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div
                              role="status"
                              className="max-w-sm animate-pulse flex justify-center items-center"
                            >
                              <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            </div>
                          )}
                          <p className="text-gray-600">Commits this year</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-700 mt-6 rounded-lg p-12">
                    <div className="text-center">
                      <h2 className="text-2xl font-semibold mb-4 -mt-6">Open Source Contributions</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-100 rounded-lg p-6">
                          {pullRequestsMerged !== undefined ? (
                            <div className="flex items-center justify-center">
                              <p className="text-5xl font-bold">
                                {pullRequestsMerged}
                              </p>
                              {pullRequestsMerged !== undefined &&
                                pullRequestsMergedLastYear !== undefined && (
                                  <div className="flex items-center -mr-2">
                                    {pullRequestsMerged - pullRequestsMergedLastYear > 0 ? (
                                      <div className="flex items-center text-4xl font-bold text-green-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="36px"
                                          viewBox="0 -960 960 960"
                                          width="36px"
                                          fill="#10B981"
                                          className="-mr-2"
                                        >
                                          <path d="m280-400 200-200 200 200H280Z" />
                                        </svg>
                                        {Math.abs(
                                          pullRequestsMerged - pullRequestsMergedLastYear,
                                        )}
                                      </div>
                                    ) : pullRequestsMerged - pullRequestsMergedLastYear ===
                                      0 ? (
                                      <div className="flex items-center text-4xl font-bold text-gray-500 ml-2">
                                        +0
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-4xl font-bold text-red-500">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="36px"
                                          viewBox="0 -960 960 960"
                                          width="36px"
                                          fill="#EF4444"
                                          className="-mr-2"
                                        >
                                          <path d="M480-360 280-560h400L480-360Z" />
                                        </svg>
                                        {Math.abs(
                                          pullRequestsMerged - pullRequestsMergedLastYear,
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div
                              role="status"
                              className="max-w-sm animate-pulse flex justify-center items-center"
                            >
                              <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            </div>
                          )}
                          <p className="text-gray-600 mt-2">
                            Pull Requests Created that have been merged this year
                          </p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-6">
                          {issuesOpened !== undefined ? (
                            <div className="flex items-center justify-center">
                              <p className="text-5xl font-bold">
                                {issuesOpened}
                              </p>
                              {issuesOpened !== undefined && issuesOpenedLastYear !== undefined && (
                                <div className="flex items-center -mr-2">
                                  {issuesOpened - issuesOpenedLastYear > 0 ? (
                                    <div className="flex items-center text-4xl font-bold text-green-500">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="36px"
                                        viewBox="0 -960 960 960"
                                        width="36px"
                                        fill="#10B981"
                                        className="-mr-2"
                                      >
                                        <path d="m280-400 200-200 200 200H280Z" />
                                      </svg>
                                      {Math.abs(
                                        issuesOpened - issuesOpenedLastYear,
                                      )}
                                    </div>
                                  ) : issuesOpened - issuesOpenedLastYear ===
                                    0 ? (
                                    <div className="flex items-center text-4xl font-bold text-gray-500 ml-4">
                                      +0
                                    </div>
                                  ) : (
                                    <div className="flex items-center text-4xl font-bold text-red-500">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        height="36px"
                                        viewBox="0 -960 960 960"
                                        width="36px"
                                        fill="#EF4444"
                                        className="-mr-2"
                                      >
                                        <path d="M480-360 280-560h400L480-360Z" />
                                      </svg>
                                      {Math.abs(
                                        issuesOpened - issuesOpenedLastYear,
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div
                              role="status"
                              className="max-w-sm animate-pulse flex justify-center items-center"
                            >
                              <div className="h-8 bg-gray-200 rounded-full dark:bg-gray-700 w-20 mb-4"></div>
                            </div>
                          )}
                          <p className="text-gray-600">
                            Issues Opened this year
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
