/* eslint-disable max-len */
// const serverDirPath = __dirname;

// const NODE_ENV = process.env.NODE_ENV || 'production';

// module.exports = {
//   apps: [
//     {
//       name: 'staff-server__v2',
//       script: `${serverDirPath}/server.js`,
//       autorestart: true, // true by default. if false, PM2 will not restart your app if it crashes or ends peacefully
//       watch: false, // enable watch & restart feature, if a file change in the folder or subfolder, your app will get reloaded
//       max_memory_restart: '1G', // your app will be restarted if it exceeds the amount of memory specified. human-friendly format : it can be “10M”, “100K”, “2G” and so on…
//       instances: 1, // number of app instance to be launched
//       exec_mode: 'cluster', // mode to start your app, can be “cluster” or “fork”, default fork
//       env: {
//         NODE_ENV,
//       }, // env variables which will appear in your app
//     },
//   ],
// };
