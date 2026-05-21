export default () => {
  const env = import.meta.env

  interface Config {
    baseUrl: string;
    mode: string;
    mockApi: boolean;
  }

  const baseConfig: Config = {
    baseUrl: env.VITE_API_BASE_URL || '/api/',
    mode: env.MODE,
    mockApi: env.VITE_USE_MOCK_API !== 'false'
  }

  return baseConfig
}
