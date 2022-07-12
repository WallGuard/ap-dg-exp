const path = require('path');
// import { loadFilesSync } from '@graphql-tools/load-files';
// import { mergeTypeDefs } from '@graphql-tools/merge';

const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typesArray = loadFilesSync(path.join(__dirname, './*.gql'));

// export default mergeTypeDefs(typesArray, { all: true });
module.exports = mergeTypeDefs(typesArray, { all: true });
