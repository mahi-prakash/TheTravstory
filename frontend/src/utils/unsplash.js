const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

export const fetchPhoto = async (query) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${ACCESS_KEY}`,
        },
      }
    );
    const remaining = res.headers.get("X-Ratelimit-Remaining");

    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        console.warn("Unsplash: Rate Limit Exceeded or Access Forbidden");
      }
      return null;
    }
    const data = await res.json();
    return data.results?.[0]?.urls?.small || null;
  } catch (error) {
    console.error("Unsplash fetch failed:", error.message);
    return null;
  }
};