export async function getAllProviderSearchResults(searchTerm: string, providers: string[]) {
  const searchPromises = providers.map((provider) =>
    window.api.getExtensionResult(provider, 'search', searchTerm)
  );

  const results = await Promise.allSettled(searchPromises);

  const wrapResult = (provider: string, result: any) => ({
    [provider]: result?.value || []
  });

  const searchResults: Array<Record<string, any>> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      searchResults.push(wrapResult(providers[index], result));
    }
  });

  return searchResults;
}
