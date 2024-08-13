export interface Options {
    [x: string]: unknown;
    version: string | undefined;
    dryRun: boolean;
    verbose: boolean;
    'any-branch': boolean;
    anyBranch: boolean;
    yolo: boolean;
    yarn: boolean;
    projects: string[] | undefined;
    _: Array<string | number>;
    $0: string;
}
