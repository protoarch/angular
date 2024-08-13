require('symbol-observable'); // Important: This needs to be first to prevent weird Observable incompatibilities

import streamToObservable from '@samverschueren/stream-to-observable';
import {execa} from 'execa';
import * as fs from 'fs';
import Listr from 'listr';
import gitTasks from 'np/source/git-tasks';
import prerequisiteTasks from 'np/source/prerequisite-tasks';
import util from 'np/source/util';
import * as path from 'path';
import * as pkgDir from 'pkg-dir';
import {merge} from 'rxjs';
import {filter} from 'rxjs/operators';
import split from 'split';

import {Options} from './models';

const exec = (cmd, args) => {
    // Use `Observable` support if merged https://github.com/sindresorhus/execa/pull/26
    const cp = execa(cmd, args);

    return merge(
        streamToObservable(cp.stdout?.pipe(split())),
        streamToObservable(cp.stderr?.pipe(split())),
        cp,
    ).pipe(filter(Boolean));
};

const npExec = async (input = 'patch', options: Options) => {
    const rootDir = await pkgDir.packageDirectory();
    const pkg = util.readPkg('./');
    const hasLockFile =
        rootDir &&
        (fs.existsSync(path.resolve(rootDir, 'package-lock.json')) ||
            fs.existsSync(path.resolve(rootDir, 'npm-shrinkwrap.json')));
    const testScript = 'test';
    const testCommand = ['run', testScript];

    const tasks = new Listr(
        [
            {
                title: 'Prerequisite check',
                enabled: () => !options.dryRun,
                task: () => prerequisiteTasks(input, pkg, options),
            },
            {
                title: 'Git',
                task: () => gitTasks(options),
            },
        ],
        {
            showSubtasks: false,
        },
    );

    /*
    tasks.add([
        {
            title: 'Cleanup',
            enabled: () => !hasLockFile,
            task: () => del('node_modules'),
        },
        {
            title: 'Installing dependencies using npm',
            task: () => {
                const args = hasLockFile
                    ? ['ci']
                    : ['install', '--no-package-lock', '--no-production'];
                return exec('npm', [...args, '--engine-strict']);
            },
        },
    ]);
    */

    if (!options.yolo) {
        tasks.add([
            {
                title: 'Running tests using npm',
                task: () => exec('npm', testCommand),
            },
        ]);
    }

    await tasks.run();
};

export default npExec;
