const DEFAULT_MS = 280;

export async function mockDelay(ms: number = DEFAULT_MS): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
