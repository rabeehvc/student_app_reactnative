// COPY THIS FILE AND UPDATE TO MATCH LOCAL DEV ENV

// API URL NOTES:
// If you use local vm for development, apple requires correct HTTPS cert ; the error is not intuitive.
// DLT - I use dave.fridaysis.com so the legit *.fridaysis.com cert works properly.
const apiBaseUrl = "https://mobileapi.fridaysis.com/externalApi/v1/";
// Fill these out in your local gitignored copy of this file to allow quick login.
// !!!!!!!!! DO NOT DISTRIBUTE WITH THESE FILLED OUT !!!!!!!!!!
const defaultUsername = ""; // use for dev ONLY - do not fill for qa /prod
const defaultPassword = ""; // use for dev ONLY - do not fill for qa /prod

export { apiBaseUrl, defaultUsername, defaultPassword };
