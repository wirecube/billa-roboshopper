declare global {
    namespace NodeJS {
      interface ProcessEnv {
        JSON_FILENAME: string;
        BILLA_EMAIL: string;
        BILLA_PASSWORD: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}