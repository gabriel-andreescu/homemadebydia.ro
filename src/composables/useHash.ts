/**
 * Shared hash utilities.
 * Uses replaceState to avoid history pollution + dispatches custom event for listeners.
 */

const HASH_UPDATE_EVENT = "hashupdate";

export function setHash(hash: string) {
  if (typeof window === "undefined") return;

  const { pathname, search } = window.location;
  const nextUrl = hash ? `${pathname}${search}#${hash}` : `${pathname}${search}`;
  history.replaceState(null, "", nextUrl);
  window.dispatchEvent(new CustomEvent(HASH_UPDATE_EVENT));
}

export function getHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash.slice(1);
}

export function onHashUpdate(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener(HASH_UPDATE_EVENT, callback);

  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener(HASH_UPDATE_EVENT, callback);
  };
}

