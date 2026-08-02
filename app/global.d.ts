declare global {
  interface Window {
    /** Set by Loader once the splash is dismissed; Hero reads it on remount. */
    __alpoeEntered?: boolean;
  }
}

export {};
