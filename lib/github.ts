import { env } from "@/lib/env"

export async function getRepo() {
  const res = await fetch(
    `https://api.github.com/repos/${env.githubRepoSlug}`,
    {
      headers: {
        Authorization: `Bearer ${env.githubToken}`,
        Accept: "application/vnd.github+json",
      },
      next: { revalidate: 3600 }, // cache for 1 hour
    }
  )

  if (!res.ok) throw new Error("GitHub API failed")

  return res.json()
}

export async function getStars() {
  const repo = await getRepo()
  return repo.stargazers_count as number
}
