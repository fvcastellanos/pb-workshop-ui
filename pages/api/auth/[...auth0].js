import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export default handleAuth({

    login: async (request, response) => await handleLogin(request, response, {
      authorizationParams: {
          audience: process.env.AUTH0_AUDIENCE,
          scope: process.env.AUTH0_SCOPE
      }
    })
});
