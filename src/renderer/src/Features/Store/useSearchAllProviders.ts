export async function searchProvidersProgressively(
  searchTerm: string,
  providers: string[],
  onProviderComplete: (provider: string, results: any) => void,
  onProviderStart: (provider: string) => void,
  onProviderError: (provider: string, error: any) => void
) {
  // Start all provider searches simultaneously
  providers.forEach((provider) => {
    onProviderStart(provider)
    
    window.api
      .getExtensionResult(provider, 'search', searchTerm)
      .then((results) => {
        onProviderComplete(provider, results)
      })
      .catch((error) => {
        console.error(`Error searching ${provider}:`, error)
        onProviderError(provider, error)
        onProviderComplete(provider, []) // Complete with empty results on error
      })
  })
}

// Keep the old function for backward compatibility if needed
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
