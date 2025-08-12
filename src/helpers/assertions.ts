function stripAccents(s: string) {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function extractErrorText(body: unknown): string {
  if (typeof body === 'string') return stripAccents(body)

  if (body && typeof body === 'object') {
    const b = body as Record<string, unknown>
    const raw =
      (typeof b.message === 'string' && b.message) ||
      (typeof b.mensagem === 'string' && b.mensagem) ||
      (typeof b.id === 'string' && b.id) ||
      JSON.stringify(body)
    return stripAccents(String(raw))
  }
  return ''
}

export function expectErrorContains(body: unknown, fragments: string[]) {
  const msg = extractErrorText(body).toLowerCase()
  fragments.forEach((f) => expect(msg).to.include(f))
}
