// Runs in mongosh via /docker-entrypoint-initdb.d, so the mongo container's
// own environment is readable here -- keeps credentials out of version control
db.createUser({
  user: process.env.MONGO_APP_USERNAME,
  pwd: process.env.MONGO_APP_PASSWORD,
  roles: [
    {
      role: 'dbOwner',
      db: process.env.MONGO_INITDB_DATABASE,
    },
  ],
});

db.createCollection('todos');

db.todos.insert({ text: 'Write code', done: true });
db.todos.insert({ text: 'Learn about containers', done: false });
