module.exports = {
    apps: [
      {
        name: 'erpalumnibackend',     // Replace with your app name
        script: 'dist/src/server.js',  // Path to your application entry point
        instances: 1,       // Number of instances to run (you can adjust this)
        watch: false,       // Set to true if you want PM2 to watch for file changes
        exec_mode: 'fork',  // Use 'fork' as the execution mode for Node.js applications
        env: {
          NODE_ENV: 'production'  // Set your environment variables here
        },
        env_file: '.env'    // Specify the path to your .env file
      }
    ]
  };
  