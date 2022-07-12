const PID = process?.pid | 'this is not linux/unix/mac';

export const serverStartLogo = (port, path) => {
  return (
    `     ================================================
    /                                                \\
   | 🚀 Server ready at http://localhost:${port}${path} |
    \\                                                /
     ================================================
     PID: ${PID}
   `
  )
};
