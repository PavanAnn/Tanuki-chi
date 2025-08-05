const proxyRequiredFor = new Set(['mangabat']);

export const requiresProxy = (provider: string) => proxyRequiredFor.has(provider);

export const fetchSingleProxiedImage = async (
  providerName: string,
  coverUrl: string,
  currentProxied: Record<string, string>
): Promise<string | null> => {
  if (!requiresProxy(providerName)) return coverUrl;
  if (currentProxied[coverUrl]) return currentProxied[coverUrl];

  try {
    const result = await window.api.getExtensionResult(providerName, 'proxy', coverUrl);
    const proxiedUrl = `data:${result.contentType};base64,${result.data}`;
    currentProxied[coverUrl] = proxiedUrl;
    return proxiedUrl;
  } catch (err) {
    console.error(`Failed to proxy image for ${providerName}: ${coverUrl}`, err);
    return null;
  }
};
