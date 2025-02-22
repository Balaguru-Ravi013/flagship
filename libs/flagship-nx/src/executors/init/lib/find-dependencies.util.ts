import type { ProjectConfiguration, ProjectGraph, Tree } from '@nrwl/devkit';
import { readJson } from '@nrwl/devkit';
import { join } from 'path';

export const findDependencies = async (
  tree: Tree,
  graph: ProjectGraph,
  originalProjectName: string
): Promise<Set<string>> => {
  const internalFindDependencies = async (
    projectName: string,
    list = new Set<string>(),
    seen = new Set<string>()
  ) => {
    // In case of bad circular dependencies
    if (seen.has(projectName)) {
      return list;
    }
    seen.add(projectName);

    const npmNode = graph.externalNodes?.[projectName];

    if (npmNode) {
      list.add(npmNode.data.packageName);
    } else {
      const project = graph.nodes[projectName];
      if (project?.type === 'lib') {
        const packageJson =
          project.data?.targets?.build?.options?.packageJson ??
          join(project.data.root, 'package.json');

        const { name } = readJson<{ name?: string }>(tree, packageJson);

        if (name) {
          list.add(name);
        }
      }

      for (const dep of graph.dependencies[projectName] ?? []) {
        await internalFindDependencies(dep.target, list, seen);
      }
    }

    return list;
  };

  const projectJson = readJson<ProjectConfiguration>(
    tree,
    join(graph.nodes[originalProjectName]?.data.root, 'project.json')
  );

  const dependencies = await internalFindDependencies(originalProjectName);

  const executors = Object.values(projectJson.targets ?? {})
    .map(({ executor }) => executor.split(':'))
    .map(([packageName]) => packageName);

  const webpackConfigs = Object.values(projectJson.targets ?? {})
    .flatMap(({ configurations, options }) => [
      options?.webpackConfig,
      ...Object.values(configurations ?? {}).map(({ webpackConfig }) => webpackConfig),
    ])
    .filter((config) => config && !config.startsWith('.'));

  for (const packageName of [...executors, ...webpackConfigs]) {
    dependencies.add(packageName);
  }

  return dependencies;
};
