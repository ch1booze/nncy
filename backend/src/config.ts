import EmailPassword from 'supertokens-node/recipe/emailpassword';
import Session from 'supertokens-node/recipe/session';

export const appInfo = {
  appName: 'nancy',
  apiDomain: 'http://localhost:3001',
  websiteDomain: 'http://localhost:3000',
  apiBasePath: '/auth',
  websiteBasePath: '/auth',
};
export const connectionUri = 'http://localhost:3567';
export const recipeList = [EmailPassword.init(), Session.init()];
