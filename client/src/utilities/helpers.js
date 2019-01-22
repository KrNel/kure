export function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    //console.log("headers1: ", res.headers);
    //console.log("headers: ", res.headers.get('x-csrf-token'));
    return res;
  } else {
    const error = new Error(`HTTP error checking response to client, status: ${res.statusText}`);
    error.status = res.statusText;
    error.data = res.data;
    error.response = res;
    console.error(error);
    throw error;
  }
}

export function parseJson(res) {
  //console.log("headers2: ", res.headers);
  return res.json();
}
