import 'react-pdf';

declare module 'react-pdf' {
  interface Ipdfjs {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  }
  export const pdfjs: Ipdfjs;
}