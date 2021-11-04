import { Inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import {
  ABForCrawler,
  ABForRealUser,
  CookieHandler,
  CrawlerDetector,
  RandomExtractor,
  TestStartedEvent,
} from './classes';
import { error } from './error';
import { CONFIG } from './injection-tokens';
import { ABOptions } from './interfaces';

export const COOKIE_NAMESPACE = 'proto-ab-tests';

@Injectable()
export class AbService {
  private _tests: { [x: string]: ABForRealUser | ABForCrawler } = {};
  private _cookieHandler: CookieHandler;
  private _randomExtractor: RandomExtractor;
  private _defaultScope = 'default';

  private _testStarted$: Subject<TestStartedEvent> = new Subject();
  private _rootTestsStarted$: ReplaySubject<TestStartedEvent> =
    new ReplaySubject();

  constructor(
    @Inject(CONFIG) configs: ABOptions[],
    cookieHandler: CookieHandler,
    private crawlerDetector: CrawlerDetector,
    randomExtractor: RandomExtractor
  ) {
    this._cookieHandler = cookieHandler;
    this._randomExtractor = randomExtractor;

    for (const config of configs) {
      let scope: string = this._defaultScope;

      if (config.scope) {
        scope = config.scope;
      }

      if (this._tests[scope]) {
        error('Test with scope <' + scope + '> cannot be initialized twice');
      }

      this.setTest(scope, config);
      this._rootTestsStarted$.next(
        new TestStartedEvent(scope, this.getVersion(scope))
      );
    }
  }

  rootTestStartedReplay$(): Observable<TestStartedEvent> {
    return this._rootTestsStarted$.asObservable();
  }

  testStarted$(): Observable<TestStartedEvent> {
    return this._testStarted$.asObservable();
  }

  emitTestStarted(scope: string, version: string): void {
    this._testStarted$.next(new TestStartedEvent(scope, version));
  }

  getVersion(scope?: string): string {
    return this.getTest(scope).getVersion();
  }

  setVersion(version: string, scope?: string) {
    return this.getTest(scope).setVersion(version);
  }

  shouldRender(
    versions: string[],
    scope: string,
    forCrawlers: boolean
  ): boolean {
    return this.getTest(scope).shouldRender(versions, forCrawlers);
  }

  setTest(scope: string, configOrVersions: ABOptions | string[]) {
    if (this._tests[scope]) {
      return;
    }

    const isCrawler = this.crawlerDetector.isCrawler();

    this.setupScope(isCrawler, scope, this.getConfig(configOrVersions));
  }

  setTestAndEmitStarted(scope: string, configOrVersions: ABOptions | string[]) {
    this.setTest(scope, configOrVersions);
    this.emitTestStarted(scope, this.getVersion(scope));
  }

  private getConfig(configOrVersions: ABOptions | string[]): ABOptions {
    return Array.isArray(configOrVersions)
      ? { versions: configOrVersions }
      : configOrVersions;
  }

  private setupScope(isCrawler: boolean, scope: string, config: ABOptions) {
    if (isCrawler) {
      this.setupTestForCrawler(scope, config);
    } else {
      this.setupTestForRealUser(scope, config);
    }
  }

  private getTest(scope?: string): ABForRealUser | ABForCrawler {
    const scopeOrDefault = scope || this._defaultScope;

    if (!this._tests[scopeOrDefault]) {
      return new ABForRealUser([], null);
    }

    return this._tests[scopeOrDefault];
  }

  private filterVersions(versions: string[]): string[] {
    const resp: string[] = [];

    if (versions.length < 2) {
      error('You have to provide at least two versions');
    }

    for (const version of versions) {
      if (resp.indexOf(version) !== -1) {
        error(
          'Version <' +
            version +
            '> is repeated in the array of versions [ ' +
            versions.join(', ') +
            ' ]'
        );
      }

      resp.push(version);
    }

    return resp;
  }

  private setupTestForCrawler(scope: string, config: ABOptions) {
    const { versions } = config;

    if (
      !!config.versionForCrawlers &&
      versions.indexOf(config.versionForCrawlers) === -1
    ) {
      error(
        'Version for crawlers <' +
          config.versionForCrawlers +
          '> is not included in versions [ ' +
          versions.join(', ') +
          ' ]'
      );
    }

    this._tests[scope] = new ABForCrawler(config.versionForCrawlers);
  }

  private setupTestForRealUser(scope: string, config: ABOptions) {
    const versions = this.filterVersions(config.versions);

    const chosenVersion: string = this.generateVersion({
      versions,
      cookieName: COOKIE_NAMESPACE + '_' + scope,
      domain: config.domain,
      expiration: config.expiration,
      weights: config.weights,
    });

    this._tests[scope] = new ABForRealUser(versions, chosenVersion);
  }

  private generateVersion(config: {
    versions: string[];
    cookieName: string;
    domain?: string;
    expiration?: number;
    weights?: { [x: string]: number };
  }): string {
    let chosenVersion: string = this._cookieHandler.get(config.cookieName);

    if (config.versions.indexOf(chosenVersion) !== -1) {
      return chosenVersion;
    }

    this._randomExtractor.setWeights(
      this.processWeights(config.weights || {}, config.versions)
    );
    this._randomExtractor.setVersions(config.versions);
    chosenVersion = this._randomExtractor.run();
    this._cookieHandler.set(
      config.cookieName,
      chosenVersion,
      config.domain,
      config.expiration
    );

    return chosenVersion;
  }

  private processWeights(
    weights: { [x: string]: number },
    versions: string[]
  ): Array<[number, string]> {
    const processedWeights: Array<[number, string]> = [];
    let totalWeight = 0;
    const tempVersions: string[] = versions.slice(0);
    let index = -100;

    for (const key in weights) {
      index = tempVersions.indexOf(key);

      if (index === -1) {
        error(
          'Weight associated to <' +
            key +
            '> which is not included in versions [ ' +
            versions.join(', ') +
            ' ]'
        );
      }

      tempVersions.splice(index, 1);
      totalWeight += this.roundFloat(weights[key]);
      processedWeights.push([totalWeight, key]);
    }

    if (index === -100) {
      return [];
    }

    if (totalWeight >= 100) {
      error(
        'Sum of weights is <' +
          totalWeight +
          '>, while it should be less than 100'
      );
    }

    const remainingWeight: number = this.roundFloat(
      (100 - totalWeight) / tempVersions.length
    );

    for (const version of tempVersions) {
      totalWeight += remainingWeight;
      processedWeights.push([totalWeight, version]);
    }

    processedWeights[processedWeights.length - 1] = [
      100,
      processedWeights[processedWeights.length - 1][1],
    ];

    return processedWeights;
  }

  private roundFloat(x: number): number {
    return Math.round(x * 1000) / 1000;
  }
}
