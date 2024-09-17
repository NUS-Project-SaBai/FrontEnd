export async function GET(req) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search;
  console.log(req.method, apiurl);
  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;
  const res = await fetch(backendUrl)
    .then(async r => await r.json())
    .catch(error => console.log(error));
  return Response.json(res);
}

export async function POST(req) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search;

  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;
  console.log(req.method, apiurl);
  let body, res;
  if (apiurl === 'patients') {
    body = await req.formData();
    res = await fetch(backendUrl, {
      method: req.method,
      body: body,
    }).then(async r => await r.json());
  } else {
    body = await req.json();
    res = await fetch(backendUrl, {
      method: req.method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookie,
        authorization: req.headers.authorization,
      },
    }).then(async r => await r.json());
  }
  return Response.json(res);
}

export async function PATCH(req) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search;

  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;
  console.log(req.method, apiurl);
  let body, res;
  if (apiurl === 'patients') {
    body = await req.formData();
    res = await fetch(backendUrl, {
      method: req.method,
      body: body,
    }).then(async r => await r.json());
  } else {
    body = await req.json();
    res = await fetch(backendUrl, {
      method: req.method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.cookie,
        authorization: req.headers.authorization,
      },
    }).then(async r => await r.json());
  }
  return Response.json(res);
}

export async function DELETE(req) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search;
  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;
  console.log(req.method, apiurl);
  const res = await fetch(backendUrl)
    .then(async r => await r.json())
    .catch(error => console.log(error));
  return Response.json(res);
}
