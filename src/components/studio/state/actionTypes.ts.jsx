export type StudioAction =
  | { type: "SET_TAB"; tab: "editor" | "verify" }
  | { type: "UPLOAD_START" }
  | { type: "UPLOAD_SUCCESS"; imageUrl: string; imageId: string; imageName: string }
  | { type: "UPLOAD_ERROR"; error: string }
  | { type: "SET_IMAGE_URL"; url: string }
  | { type: "ADD_HOTSPOT"; hotspot: any }
  | { type: "UPDATE_HOTSPOT"; hotspot: any }
  | { type: "DELETE_HOTSPOT"; id: string }
  | { type: "SELECT_HOTSPOT"; id: string | null }
  | { type: "HOTSPOT_MOVE"; id: string; x: number; y: number }
  | { type: "FINALIZE_START" }
  | { type: "FINALIZE_SUCCESS"; logId: string; hash: string; imageFileHash: string; createdAt: string }
  | { type: "FINALIZE_ERROR"; error: string }
  | { type: "VERIFY_START"; logId: string }
  | { type: "VERIFY_SUCCESS"; result: any }
  | { type: "VERIFY_ERROR"; error: string }
  | { type: "RESET_EDITOR" }
  | { type: "RESET_HOTSPOTS" }
  | { type: "RESET_IMAGE" };