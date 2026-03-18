export function parseHash(hash) {
  let url = location.hash.slice(1).toLowerCase() || "/";
  let r = url.split("/");
  let request = {
    resource: null,
    page: 0,
    id: null,
  };
  request.resource = r[1];
  request.page = parseInt(r[2]) || 0;
  request.id = r[3];
  return request;
}
