import { initialState } from "./initialState";

export const selectImage = (state: typeof initialState) => state.imageUrl;
export const selectImageId = (state: typeof initialState) => state.imageId;
export const selectImageName = (state: typeof initialState) => state.imageName;
export const selectHotspots = (state: typeof initialState) => state.hotspots;
export const selectSelectedHotspot = (state: typeof initialState) =>
  state.hotspots.find(h => h.id === state.selectedHotspotId) || null;
export const selectIsFinalizing = (state: typeof initialState) => state.finalizeLoading;
export const selectVerifyResult = (state: typeof initialState) => state.verifyResult;
export const selectTab = (state: typeof initialState) => state.tab;
export const selectUploadLoading = (state: typeof initialState) => state.uploadLoading;
export const selectFinalizeResult = (state: typeof initialState) => ({
  logId: state.lastFinalizedLogId,
  hash: state.lastFinalizedHash,
  imageFileHash: state.lastFinalizedImageFileHash,
  createdAt: state.lastFinalizedCreatedAt
});