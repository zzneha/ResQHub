declare module 'react' {
    const content: any;
    export default content;
  }
  
  declare module 'react-dom' {
    const content: any;
    export default content;
  }
  declare module 'react' {
    export type ReactNode = any; // Override ReactNode type
  }
  