const config = {
 app: {
   client: {
     port: 3000
   },
   server: {
     port: 3001
   },
 },
 db: {
   host: '127.0.0.1',
   port: 27017,
   name: 'kure'
 },
 env: "development"
};

export default config;
