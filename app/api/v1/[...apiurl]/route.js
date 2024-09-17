export async function GET(req) {
  const res = await get_delete(req);
  return Response.json(res);
}

export async function POST(req) {
  const res = await patch_post(req);
  return Response.json(res);
}

export async function PATCH(req) {
  const res = await patch_post(req);
  return Response.json(res);
}

export async function DELETE(req) {
  const res = await get_delete(req);
  return Response.json(res);
}

async function get_delete(req) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search;
  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;
  console.log(req.method, apiurl);

  const res = await fetch(backendUrl, { method: req.method })
    .then(async r => await r.json())
    .catch(error => console.log(error));
  return res;
}

async function patch_post(req) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search;
  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;
  console.log(req.method, apiurl);

  let body, res;
  if (apiurl.split('/')[0] === 'patients') {
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
        Authorization: req.headers.get('authorization'),
      },
    }).then(async r => await r.json());
  }
  return res;
}
