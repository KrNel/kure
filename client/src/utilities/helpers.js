export function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    //console.log("headers1: ", res.headers);
    //console.log("headers: ", res.headers.get('x-csrf-token'));
    return res;
  } else {
    const error = new Error(`HTTP rrror checking response status ${res.statusText}`);
    error.status = res.statusText;
    error.response = res;
    console.log(error);
    throw error;
  }
}

export function parseJson(res) {
  //console.log("headers2: ", res.headers);
  return res.json();
}
