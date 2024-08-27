import { useState } from "vue-gtag-next";
import cookieConsentSettings from "../assets/cookieConsentSettings.json";

export default function useCookieConsent() {
  window.addEventListener("DOMContentLoaded", () => {
    if (!Object.hasOwn(window, "initCookieConsent")) {
      return;
    }

    const analyticsState = useState();

    analyticsState.isEnabled!.value = /^(.*;)?\s*cc_cookie\s*=\s*[^;]/.test(document.cookie);

    // @ts-ignore
    cookieConsentSettings.onFirstAction = (user_preferences, cookie) => {
      analyticsState.isEnabled!.value = cookie.level.includes("analytics");
    };

    // @ts-ignore
    cookieConsentSettings.onChange = (cookie) => {
      analyticsState.isEnabled!.value = cookie.level.includes("analytics");
    };

    // @ts-ignore
    const cc = window.initCookieConsent();
    cc.run(cookieConsentSettings);
  });
}
