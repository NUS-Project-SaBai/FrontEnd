export async function GET(req) {
  // Check if the request is for an image or a PDF file
  const isImageRequest =
    req.nextUrl.pathname.endsWith('.jpg') ||
    req.nextUrl.pathname.endsWith('.jpeg') ||
    req.nextUrl.pathname.endsWith('.png');
  const isPDFRequest = req.nextUrl.pathname.endsWith('.pdf');

  if (isImageRequest) {
    // Handle image request (e.g., JPG, JPEG, PNG)
    const file = await getFile(req);

    if (!file) {
      return new Response('File not found', { status: 404 });
    }

    return new Response(file, {
      headers: {
        'Content-Type': 'image/jpeg', // specify the content type for JPG files
      },
    });
  } else if (isPDFRequest) {
    // Handle PDF request
    const file = await getFile(req);

    if (!file) {
      return new Response('File not found', { status: 404 });
    }

    return new Response(file, {
      headers: {
        'Content-Type': 'application/pdf', // specify the content type for PDFs
      },
    });
  } else {
    // Handle other requests (like JSON data)
    const res = await get_delete(req);
    return Response.json(res);
  }
}

// Helper function to get any file type (image, PDF, etc.)
async function getFile(req, fileType) {
  let apiurl = req.nextUrl.pathname.slice(8) + req.nextUrl.search; // adjust to extract file path
  const backendUrl = `http://127.0.0.1:8000/${apiurl}`;

  console.log(`GET request for ${fileType} file:`, apiurl);

  try {
    const res = await fetch(backendUrl, { method: 'GET' });

    if (res.ok) {
      // Read the file as binary using arrayBuffer
      const buffer = await res.arrayBuffer();
      return Buffer.from(buffer); // Return the file data as a Buffer
    } else {
      throw new Error(
        `${fileType.charAt(0).toUpperCase() + fileType.slice(1)} not found`
      );
    }
  } catch (error) {
    console.error(error);
    return null;
  }
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

  // Check if the URL is for file upload
  if (apiurl.startsWith('upload')) {
    console.log('Handling file upload...');
    const uploadBackendUrl = `http://127.0.0.1:8000/${apiurl}/`;

    // Parse form data (can include files)
    body = await req.formData();

    try {
      const backendResponse = await fetch(uploadBackendUrl, {
        method: req.method,
        body: body, // Send the form data directly
      });

      // Check if the backend returned a successful response
      if (!backendResponse.ok) {
        console.error(
          'Error: Backend returned an error response',
          backendResponse.status
        );
        return new Response(`Backend error: ${backendResponse.statusText}`, {
          status: backendResponse.status,
        });
      }

      // Check the Content-Type of the response to determine if it's JSON
      const contentType = backendResponse.headers.get('Content-Type');

      // If the response is JSON, parse it
      if (contentType && contentType.includes('application/json')) {
        res = await backendResponse.json();
      } else {
        // If it's not JSON, return the raw response text or handle differently
        const textResponse = await backendResponse.text();
        console.warn('Non-JSON response received:', textResponse);
        res = {
          message: 'File uploaded, but the server did not return JSON.',
          rawResponse: textResponse,
        };
      }
    } catch (error) {
      console.error('File upload failed:', error);
      return new Response('Failed to upload file', { status: 500 });
    }
  } else if (apiurl.split('/')[0] === 'patients') {
    // Handle patients form data (non-file data)
    body = await req.formData(); // Handle non-file form data
    try {
      const backendResponse = await fetch(backendUrl, {
        method: req.method,
        body: body, // Send form data
      });
      res = await backendResponse.json();
    } catch (error) {
      console.error('Patient data request failed:', error);
      return new Response('Failed to process patient data', { status: 500 });
    }
  } else {
    // Handle standard JSON body data (non-file, non-form data)
    body = await req.json();
    try {
      const backendResponse = await fetch(backendUrl, {
        headers: req.headers,
        method: req.method,
        body: JSON.stringify(body),
      });
      res = await backendResponse.json();
    } catch (error) {
      console.error('JSON request failed:', error);
      return new Response('Failed to process JSON data', { status: 500 });
    }
  }

  return res;
}
