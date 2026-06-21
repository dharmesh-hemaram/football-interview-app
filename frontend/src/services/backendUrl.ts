const getBackendUrl = (): string => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL.replace('/api', '');

  const { hostname, protocol } = window.location;

  // CodeSandbox forwards ports as: <id>-<port>.csb.app — replace whatever port is present with 3001
  if (hostname.endsWith('.csb.app')) {
    const backendHost = hostname.replace(/-\d+\.csb\.app$/, '-3001.csb.app');
    return `${protocol}//${backendHost}`;
  }

  return 'http://localhost:3001';
};

export const BACKEND_URL = getBackendUrl();
