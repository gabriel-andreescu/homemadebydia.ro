type RevealHandler = (targetId: string) => Promise<void> | void;

let revealHandler: RevealHandler | null = null;

export function registerLazySectionReveal(handler: RevealHandler) {
  revealHandler = handler;

  return () => {
    if (revealHandler === handler) {
      revealHandler = null;
    }
  };
}

export async function revealLazySectionsForTarget(targetId: string) {
  if (!revealHandler) return;
  await revealHandler(targetId);
}
