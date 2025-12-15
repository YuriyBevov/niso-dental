function deleteCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// deleteCookie("GREATSEO_COOKIE_CONSENT");

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-consent-banner");

  const showCookieBanner = () => {
    banner.style.display = "grid";
  };

  const showCookieBannerIfNotAccepted = () => {
    if (!document.cookie.includes("NISODENTAL_COOKIE_CONSENT=ACCEPTED")) {
      setTimeout(showCookieBanner, 3000);
    }
  };

  showCookieBannerIfNotAccepted();

  const button = document.getElementById("cookie-consent-button");

  button.addEventListener("click", () => {
    document.cookie =
      "NISODENTAL_COOKIE_CONSENT=ACCEPTED; path=/; max-age=" +
      365 * 24 * 60 * 60;
    banner.style.display = "none";
    // console.log("saved cookie", document.cookie);
  });
});
