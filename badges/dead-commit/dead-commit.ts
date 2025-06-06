import { Commit, define, Repository, plural } from '#src'

export default define({
  url: import.meta.url,
  badges: ['dead-commit'] as const,
  present(data, grant) {
    const commits: { repo: Repository; commit: Commit }[] = []

    for (const repo of data.repos) {
      for (const commit of repo.commits) {
        if (commit.sha.includes('dead')) {
          commits.push({ repo, commit })
        }
      }
    }

    const text = commits
      .map(({ repo, commit }) => {
        const sha = commit.sha.replace(/dead/, '<strong>dead</strong>')
        return `- <a href="https://github.com/${repo.owner.login}/${repo.name}/commit/${commit.sha}">${sha}</a>`
      })
      .join('\n')

    if (commits.length >= 1) {
      grant(
        'dead-commit',
        `I pushed a commit with "dead" ${plural(
          commits.length,
          'once',
          '%d times',
        )}.`,
      ).evidence(text)
    }
  },
})
