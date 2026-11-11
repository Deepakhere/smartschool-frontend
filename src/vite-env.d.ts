/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_SHOW_SMALL_SCREEN_NOTICE?: string;
}
