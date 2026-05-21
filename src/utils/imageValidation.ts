export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const validateImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Unsupported format. Use JPG, PNG, or WebP.";
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Image is too large. Maximum upload size is 10MB.";
  }

  return null;
};
