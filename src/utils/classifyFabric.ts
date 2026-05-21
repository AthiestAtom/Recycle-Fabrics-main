const API_TIMEOUT_MS = 30_000;
const DEFAULT_API_ORIGIN = "https://recycle-fabrics-main.onrender.com";

export const getApiOrigin = () => {
  return import.meta.env.VITE_API_ORIGIN || DEFAULT_API_ORIGIN;
};

export const getClassificationUrl = () => {
  return import.meta.env.VITE_API_URL || `${getApiOrigin()}/api/classify-fabric`;
};

export const classifyFabricImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const apiUrl = getClassificationUrl();

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      body: formData,
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Server error: ${response.status}`;

      try {
        const errorBody = await response.json();
        message = errorBody.error || message;
      } catch {
        // Keep the status-based message if the server did not return JSON.
      }

      throw new Error(message);
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};
