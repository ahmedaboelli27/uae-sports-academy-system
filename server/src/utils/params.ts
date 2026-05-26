export function paramId(value: string | string[]): string {
  const id = Array.isArray(value) ? value[0] : value;
  if (!id) {
    throw new Error('Missing route parameter id');
  }
  return id;
}
