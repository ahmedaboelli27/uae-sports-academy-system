/** When true (default), the UI uses in-memory mock services. Set false to call the Express API. */
export const USE_MOCK_API =
  (import.meta.env.VITE_USE_MOCK_API ?? 'true').toString().toLowerCase() !== 'false';
