import { apiClient } from "./api.client";

export const mediaService = {
  upload: async (file: File): Promise<{ url: string; filename: string; content_type: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/media/upload", formData);
  }
};
