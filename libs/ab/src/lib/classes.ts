import { error } from './error';

export class ABForRealUser {
  private _versions: string[] = [];
  private _chosenVersion: string;

  constructor(versions: string[], chosenVersion: string | null) {
    this._versions = versions;
    this._chosenVersion = chosenVersion ?? '';
  }

  getVersion(): string {
    return this._chosenVersion;
  }

  setVersion(version: string) {
    if (this._versions.indexOf(version) === -1) {
      error(
        'Version <' +
          version +
          '> has not been declared: [ ' +
          this._versions.join(', ') +
          ' ]'
      );
    }

    this._chosenVersion = version;
  }

  shouldRender(versions: string[], forCrawlers: boolean): boolean {
    for (const version of versions) {
      if (this._versions.indexOf(version) === -1) {
        error(
          'Version <' +
            version +
            '> has not been declared: [ ' +
            this._versions.join(', ') +
            ' ]'
        );
      }
    }

    return versions.indexOf(this._chosenVersion) !== -1;
  }
}

export class ABForCrawler {
  private _version: string;

  constructor(version?: string) {
    if (version) {
      this._version = version;
    }
  }

  getVersion(): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setVersion(version: string) {
    throw new Error('Not implemented');
  }

  shouldRender(versions: string[], forCrawlers: boolean): boolean {
    return (
      forCrawlers || (!!this._version && versions.indexOf(this._version) !== -1)
    );
  }
}

export class RandomExtractor {
  private _weights: Array<[number, string]>;
  private _versions: string[];

  setWeights(weights: Array<[number, string]>) {
    this._weights = weights;
  }

  setVersions(versions: string[]) {
    this._versions = versions;
  }

  run(): string {
    if (this._weights.length === 0) {
      return this._versions[Math.floor(Math.random() * this._versions.length)];
    }

    const random: number = Math.random() * 100;

    for (const weight of this._weights) {
      if (random <= weight[0]) {
        return weight[1];
      }
    }

    return this._versions[0];
  }
}

export abstract class AbstractUserAgentCrawlerDetector {
  // eslint-disable-next-line max-len
  private _regexps =
    /googlebot|http:\/\/yandex\.com\/bots|Aport|StackRambler|Mail.RU|yahoo|bingbot|baiduspider|twitterbot|facebookexternalhit|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkShare|W3C_Validator|redditbot|Applebot|WhatsApp|flipboard|tumblr|bitlybot/;

  isCrawler() {
    return this._regexps.test(this.getUserAgentString());
  }

  protected abstract getUserAgentString(): string;
}

export class CrawlerDetector extends AbstractUserAgentCrawlerDetector {
  protected getUserAgentString() {
    return window.navigator.userAgent;
  }
}

export class CookieHandler {
  public get(name: string): string {
    name = encodeURIComponent(name);

    const regexp = new RegExp(
      '(?:^' + name + '|;\\s*' + name + ')=(.*?)(?:;|$)',
      'g'
    );
    const results = regexp.exec(document.cookie);

    return !results ? '' : decodeURIComponent(results[1]);
  }

  public set(name: string, value: string, domain?: string, expires?: number) {
    let cookieStr =
      encodeURIComponent(name) + '=' + encodeURIComponent(value) + ';';

    if (expires) {
      const dtExpires = new Date(
        new Date().getTime() + expires * 1000 * 60 * 60 * 24
      );

      cookieStr += 'expires=' + dtExpires.toUTCString() + ';';
    }

    if (domain) {
      cookieStr += 'domain=' + domain + ';';
    }

    document.cookie = cookieStr;
  }
}

export class TestStartedEvent {
  constructor(public scope: string, public version: string) {}
}
