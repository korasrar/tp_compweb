export function parseHash(hash) {
  let url = location.hash.slice(1).toLowerCase() || "/";
  let r = url.split("/");

  let request = {
    resource: null,
    id: null,
    page: null,
  };

  request.resource = r[1] || null;

  // Gestion des routes : /list/:page et /detail/:id
  if (request.resource === "list") {
    request.page = parseInt(r[2]) || 1; // page 1 par défaut
  } else if (request.resource === "detail") {
    request.id = parseInt(r[2]) || 0;
  }

  return request;
}
