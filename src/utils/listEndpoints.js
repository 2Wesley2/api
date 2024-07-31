// utils/listEndpoints.js

const cleanPath = (path) => {
  return path
    .replace(/\/\?\(\?=\/\|\$\)\//g, '/')
    .replace(/\(\?:\(\[\^\\\/]\+\?\)\)/g, ':param');
};

const listEndpoints = (app) => {
  const endpoints = [];

  const getEndpoints = (stack, basePath = '') => {
    stack.forEach((middleware) => {
      if (middleware.route) {
        // Rotas registradas diretamente no app
        endpoints.push({
          path: cleanPath(basePath + middleware.route.path),
          method: Object.keys(middleware.route.methods)[0].toUpperCase(),
        });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        // Rotas adicionadas como middleware de roteador
        getEndpoints(
          middleware.handle.stack,
          basePath +
            (middleware.regexp.source
              .replace(/\\/g, '')
              .replace('^', '')
              .replace(/\(\?:\(\[\^\\\/]\+\?\)\)/g, ':param')
              .replace('?(?=\\/|$)', '') || ''),
        );
      }
    });
  };

  getEndpoints(app._router.stack);

  return endpoints;
};

module.exports = listEndpoints;
