interface StorageWriter {
  setItem(key: string, value: string): void;
}

export function trySetStorageItem(
  getStorage: () => StorageWriter,
  key: string,
  value: string,
): boolean {
  try {
    getStorage().setItem(key, value);
    return true;
  } catch {
    return false;
  }
}
