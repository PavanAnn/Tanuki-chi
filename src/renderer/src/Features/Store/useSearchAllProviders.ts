
export async function getAllProviderSearchResults(searchTerm: string) {
  // List of providers you want to search across
  const providers = ['mangadex', 'mangafox', 'weebcentral']; // Add more as necessary

  const searchPromises = providers.map((provider) =>
    window.api.getExtensionResult(provider, 'search', searchTerm) // Calling the dynamic extension method
  );

  // Wait for all provider search results
  const results = await Promise.allSettled(searchPromises);

  // Function to wrap each result from the provider
  const wrapResult = (provider: string, result: any) => ({
    [provider]: result?.value || [] // Handle the data response correctly
  });

  // Collect the results into an array
  const searchResults: Array<Record<string, any>> = [];

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      searchResults.push(wrapResult(providers[index], result)); // Wrap the result based on the provider
    }
  });

  return searchResults;
}
