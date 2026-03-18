export function parseHash(hash) {
  let url = location.hash.slice(1).toLowerCase() || "/";
  let r = url.split("/");
  let request = {
    resource: null,
    id: null,
  };
  request.resource = r[1];
  request.id = r[2];

  return request;
}
