export type FhOption = RequestInit & {
  json?: unknown;
};
// interface RequestInit {
//   body?: BodyInit | null;
//   cache?: RequestCache;
//   credentials?: RequestCredentials;
//   headers?: HeadersInit;
//   integrity?: string;
//   keepalive?: boolean;
//   method?: string;
//   mode?: RequestMode;
//   redirect?: RequestRedirect;
//   referrer?: string;
//   referrerPolicy?: ReferrerPolicy;
//   signal?: AbortSignal | null;
//   window?: any;
// }

export class Fh {
  constructor(public input: Request | URL | string, public option?: FhOption) {}

  private async _fetch() {
    const option = this.option || {};
    option.method = (option.method || "get").toUpperCase();
    const headers = new Headers(option.headers || {});

    if (option.json) {
      option.body = JSON.stringify(option.json);
      headers.append("Content-Type", "application/json");
    }

    const init: RequestInit = {
      ...option,
      headers,
    } as RequestInit;
    // console.log({ init });
    return await fetch(this.input, init);
  }

  async text() {
    return await (await this._fetch()).text();
  }

  async json() {
    return await (await this._fetch()).json();
  }
}

fh.get = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "GET" });
};
fh.post = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "POST" });
};
fh.put = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "PUT" });
};
fh.delete = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "DELETE" });
};
fh.head = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "HEAD" });
};
fh.options = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "OPTIONS" });
};
fh.trace = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "TRACE" });
};
fh.connect = function (input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "CONNECT" });
};

export function fh(input: Request | URL | string, init?: FhOption): Fh {
  return new Fh(input, { ...init, method: "GET" });
}
