
export const environment = {
  version: require('../../package.json').version,
  production: false,
  test: false,
  apiWorkingHours: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/working-hours',
  apiProjects: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/projects',
  apiComments: 'https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/comments'
};
