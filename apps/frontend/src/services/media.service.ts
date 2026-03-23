import { apiClient } from "./api.client";

export const mediaService = {
  upload: async (file: File): Promise<{ url: string; filename: string; content_type: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/media/upload", formData, async () => {
      return {
        url: URL.createObjectURL(file), // Use local blob URL for demo
        filename: file.name,
        content_type: file.type
      };
    });
  }
};
