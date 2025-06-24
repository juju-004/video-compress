export type FileActions = {
  file: File;
  fileName: string;
  fileSize: number;
  from: string;
  fileType: string;
  fileCategory: "i" | "v";
  isError?: boolean;
  url?: string;
  output?: any;
  outputBlob?: Blob;
};

export enum VideoFormats {
  MP4 = "mp4",
  MKV = "mkv",
  AVI = "avi",
  MOV = "mov",
  FLV = "flv",
  WEBM = "webm",
}

export enum QualityType {
  Hight = "15",
  Medium = "18",
  Low = "20",
}

export enum MaxSize {
  Full = 100,
  Ninety = 90,
  SeventyFive = 75,
  Half = 50,
}
export enum MaxWidth {
  Full = 100,
  Ninety = 90,
  SeventyFive = 75,
  Half = 50,
}

export type ImageInputSettings = {
  maxSize: MaxSize;
  maxWidth: MaxWidth;
};
export type VideoInputSettings = {
  quality: QualityType;
  videoType: VideoFormats;
  customEndTime: number;
  customStartTime: number;
  removeAudio: boolean;
  twitterCompressionCommand: boolean;
};
