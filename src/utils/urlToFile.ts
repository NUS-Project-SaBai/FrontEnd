export function urlToFile(url: string, filename: string, mimeType: string) {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => new File([buf], filename, { type: mimeType }));
}
