import pathToRegexp from 'path-to-regexp';

interface MusicParameters {
  id: string;
}

const createRoute = <P extends object = object>(route: string) => ({
  path: route,
  toPath: pathToRegexp.compile<P>(route),
});

const routes = {
  list: createRoute("/"),
  music: createRoute("/music/:id"),
}

export default routes;