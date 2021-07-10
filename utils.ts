// https://qiita.com/akebi_mh/items/a60310dc44be5691742b
// https://zenn.dev/kawarimidoll/articles/b1d9bc15aaa99c
export function iso8601(date: Date): string {
  const d = new Date(date.getTime() - date.getTimezoneOffset() * 6e4);
  return d.toISOString().slice(0, -5) +
    d.toString().replace(/^.*GMT([-+]\d{2})(\d{2}).*$/, "$1:$2");
}
