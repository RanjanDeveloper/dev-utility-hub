export const env = {
  siteName: process.env.NEXT_PUBLIC_SITE_NAME || "Dev Utility Hub",

  // For UI links
  githubRepoUrl:
    process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
    "https://github.com/RanjanDeveloper/dev-utility-hub",

  // For GitHub API calls (IMPORTANT)
  githubRepoSlug:
    process.env.GITHUB_REPO_SLUG || "RanjanDeveloper/dev-utility-hub",

  // Secret – used only on server
  githubToken: process.env.GITHUB_TOKEN!,
}
