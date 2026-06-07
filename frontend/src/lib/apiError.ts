// Pulls the { error } message out of an RTK Query / fetchBaseQuery error.
export function getApiErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: unknown }).data;
    if (data && typeof data === 'object' && 'error' in data) {
      const message = (data as { error?: unknown }).error;
      if (typeof message === 'string') {
        return message;
      }
    }
  }
  return undefined;
}
