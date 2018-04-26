
export const environment = {
  version: require('../../package.json').version,
  production: false,
  test: true,
  apiWorkingHours: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/test/working-hours',
  apiProjects: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/test/projects',
  apiComments: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/test/comments'
};
