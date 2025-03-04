import type { Commit } from '@brandingbrand/git';

import type { ShipConfig } from '../configs/ship.config';
import { findFilteredProjectsForRevision } from '../utils/find-closed-projects.util';

export const stripCommitMessages =
  (config: ShipConfig) =>
  (commit: Commit): Commit => {
    const excludedProjects = findFilteredProjectsForRevision(config, commit).map(
      ({ name }) => name
    );

    if (
      (commit.header.scope !== null && excludedProjects.includes(commit.header.scope)) ||
      commit.header.scope === 'ci'
    ) {
      return commit
        .withDescription('')
        .withScope('repo')
        .withType('chore')
        .withSubject('project configuration');
    }

    if (
      commit.header.scope !== null &&
      excludedProjects.some((scope) => commit.header.subject.includes(scope))
    ) {
      return commit
        .withDescription('')
        .withSubject(
          commit.header.subject.replace(new RegExp(`(${excludedProjects.join('|')})`), '')
        );
    }

    return commit;
  };
