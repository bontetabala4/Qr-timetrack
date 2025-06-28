declare module "html5-qrcode" {
  export class Html5Qrcode {
    constructor(elementId: string);
    start(
      cameraConfig: string,
      config?: Record<string, unknown>,
      qrCodeSuccessCallback?: (decodedText: string, result?: unknown) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): Promise<void>;
    stop(): Promise<void>;
    clear(): void;

    // méthode statique
    static getCameras(): Promise<
      Array<{
        id: string;
        label?: string;
      }>
    >;
  }
}



declare module "html5-qrcode/minified/html5-qrcode.min.js" {
  export * from "html5-qrcode";
}