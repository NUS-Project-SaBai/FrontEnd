export type FileRowItem = {
  // Unique identifier (for uploaded documents) or composite key (for preview)
  id: string | number;

  // File name without extension
  fileName: string;

  // File extension, with the '.' dot (e.g., '.pdf', '.jpg')
  fileExt: string;

  // Optional description
  description?: string;

  // URL for file preview/download
  previewUrl: string;

  // Optional file size display (e.g., '1.2 MB')
  size?: string;

  // Optional creation timestamp (for uploaded documents)
  createdAt?: string;

  // Optional flag for duplicate detection (for preview mode)
  isDuplicated?: boolean;
};
