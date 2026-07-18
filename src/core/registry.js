export function createRouteRegistry(definitions) {
  const routes = [...definitions];

  return {
    resolve(route) {
      return (
        routes.find(
          (item) => item.cid === route.cid && item.pid === route.pid
        ) ||
        routes.find(
          (item) => item.cid === route.cid && item.pid === "*"
        ) ||
        null
      );
    },
    list() {
      return [...routes];
    }
  };
}
