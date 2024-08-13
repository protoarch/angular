import {$} from 'execa';
import {releasePublish, releaseVersion} from 'nx/src/command-line/release';
import * as yargs from 'yargs';

import gitPushWithTagsAndUpstream from './git';
import npExec from './np';
const logSymbols = require('log-symbols');

(async () => {
    const options = await yargs
        .version(false) // don't use the default meaning of version in yargs
        .option('version', {
            description: 'Explicit version specifier to use, if overriding conventional commits',
            type: 'string',
        })
        .option('dryRun', {
            alias: 'd',
            description:
                'Whether or not to perform a dry-run of the release process, defaults to true',
            type: 'boolean',
            default: true,
        })
        .option('verbose', {
            description: 'Whether or not to enable verbose logging, defaults to false',
            type: 'boolean',
            default: false,
        })
        .option('any-branch', {
            description: 'Use --any-branch to publish anyway',
            type: 'boolean',
            default: false,
        })
        .option('yolo', {
            description: 'Skip tests',
            type: 'boolean',
            default: false,
        })
        .option('yarn', {
            description: 'Skip tests',
            type: 'boolean',
            default: false,
        })
        .option('projects', {
            description: 'projects to release',
            type: 'array',
            string: true,
            default: undefined,
        })
        .parseAsync();

    await npExec(options.version ?? 'patch', options);

    const {workspaceVersion, projectsVersionData} = await releaseVersion({
        specifier: options.version,
        // stage package.json updates to be committed later by the changelog command
        stageChanges: true,
        dryRun: options.dryRun,
        verbose: options.verbose,
        gitCommit: true,
        gitTag: true,
    });

    /*
    await releaseChangelog({
        versionData: projectsVersionData,
        version: workspaceVersion,
        dryRun: options.dryRun,
        verbose: options.verbose,
        gitCommit: true,
        gitTag: true,
    });
    */

    const proc = $({
        stdio: 'inherit',
        all: true,
    })`npm exec -- nx run-many -t build -p @datana-smart/*`;

    await proc;

    await gitPushWithTagsAndUpstream(options.dryRun);

    await releasePublish({
        dryRun: options.dryRun,
        verbose: options.verbose,
    });

    process.exit(0);
})().catch(error => {
    console.error(`\n${logSymbols.error} ${error.message}`);
    process.exit(1);
});
