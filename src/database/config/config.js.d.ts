// src/database/config/config.js.d.ts
declare const config: {
    development: {
      username: string;
      password: string;
      database: string;
      host: string;
      dialect: string;
    };
    test: {
      username: string;
      password: string;
      database: string;
      host: string;
      dialect: string;
    };
    production: {
      username: string;
      password: string;
      database: string;
      host: string;
      dialect: string;
    };
  };
  
  export default config;