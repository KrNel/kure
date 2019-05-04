import Client from 'lightrpc';

const options = {
  timeout: 15000,
};

const client = new Client('https://hive.anyx.io', options);

client.sendAsync = (message, params) =>
  new Promise((resolve, reject) => {
    const request = {
      method: message,
      params: params,
    };
    client.send(request, (err, result) => {
      if (err !== null) return reject(err);
      return resolve(result);
    });
  });

  export default client;
