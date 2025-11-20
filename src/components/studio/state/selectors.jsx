export const selectImage = (state) => state.imageUrl;
export const selectImageId = (state) => state.imageId;
export const selectImageName = (state) => state.imageName;
export const selectHotspots = (state) => state.hotspots;
export const selectSelectedHotspot = (state) =>
  state.hotspots.find(h => h.id === state.selectedHotspotId) || null;
export const selectIsFinalizing = (state) => state.finalizeLoading;
export const selectVerifyResult = (state) => state.verifyResult;
export const selectTab = (state) => state.tab;
export const selectUploadLoading = (state) => state.uploadLoading;
export const selectFinalizeResult = (state) => ({
  logId: state.lastFinalizedLogId,
  hash: state.lastFinalizedHash,
  imageFileHash: state.lastFinalizedImageFileHash,
  createdAt: state.lastFinalizedCreatedAt
});