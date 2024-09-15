export default async function handler(req, res) {
  // DO NOT USE LOCALHOST!!!
  // api pages is server side. It is resolved to ipv6 address.
  const backendUrl = `http://127.0.0.1:8000/${req.url.slice(5)}`;
  if (process.env.NODE_ENV == 'development') {
    console.log(req.method, req.url);
  }
  switch (req.method) {
    case 'DELETE':
    case 'GET':
      await fetch(backendUrl)
        .then(async r => res.json(await r.json()))
        .catch(error => console.log(error));
      break;
    case 'POST':
    case 'PATCH':
      await fetch(backendUrl, {
        method: req.method,
        headers: {
          'Content-Type': req.headers['content-type'],
          Cookie: req.cookie,
          authorization: req.headers.authorization,
        },
        body: JSON.stringify(req.body),
      })
        .then(async r => res.json(await r.json()))
        .catch(error => console.log(error));
      break;
    default:
      console.error('Invalid method', req.method);
      break;
  }
}
