export async function resolve(specifier, context, defaultResolve) {
  if (!specifier.startsWith('node:') && !specifier.endsWith('.js') && !specifier.includes('://')) {
    return { url: new URL(specifier + '.js', context.parentURL).href, shortCircuit: true };
  }
  return defaultResolve(specifier, context, defaultResolve);
}
