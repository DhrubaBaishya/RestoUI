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
