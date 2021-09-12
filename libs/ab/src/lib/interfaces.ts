export interface ABOptions {
    versions: string[];
    domain?: string;
    versionForCrawlers?: string;
    scope?: string;
    expiration?: number;
    weights?: {
        [x: string]: number;
    };
}

export interface GuardData {
    ab: GuardDataTest | GuardDataTest[];
}

export interface GuardDataTest extends ABOptions {
    redirectUrls?: {[key: string]: string};
}
