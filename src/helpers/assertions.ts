export function extractErrorText(body: unknown): string {
  let raw: string;

  if (typeof body === 'string') {
    raw = body;
  } else if (body && typeof body === 'object') {
    const obj = body as Record<string, unknown>;
    const candidate = obj.message ?? obj.mensagem ?? obj.id;

    if (typeof candidate === 'string') {
      raw = candidate;
    } else if (candidate != null) {
      raw = String(candidate);
    } else {
      try {
        raw = JSON.stringify(body);
      } catch {
        raw = String(body);
      }
    }
  } else {
    raw = String(body ?? '');
  }

  return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function expectErrorContains(body: unknown, fragments: readonly string[]) {
  const msg = extractErrorText(body).toLowerCase();
  fragments.forEach((f) => expect(msg).to.include(f.toLowerCase()));
}
