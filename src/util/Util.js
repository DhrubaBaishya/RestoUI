export function generateURL(url, key, value) {
  var result = url;
  if (key != null) {
    for (var i = 0; i < key.length; i++) {
      if (i === 0) {
        result = result + "?" + key[i] + "=" + value[i];
      } else {
        result = result + "&" + key[i] + "=" + value[i];
      }
    }
  }
  return result;
}

export function validateResponse(response) {
  if (
    response !== null &&
    response.data !== null &&
    response.data.result != null &&
    response.data.result.length > 0
  )
    return true;
  else return false;
}
