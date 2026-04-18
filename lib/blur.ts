/**
 * Tiny 8x5 base64 JPEG used as a universal blur placeholder.
 * Intentionally generic — individual images can override via their own blurDataURL.
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 25">
       <defs>
         <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
           <stop offset="0%" stop-color="#14141A"/>
           <stop offset="100%" stop-color="#0A0A0B"/>
         </linearGradient>
       </defs>
       <rect width="40" height="25" fill="url(#g)"/>
     </svg>`,
  ).toString("base64");
