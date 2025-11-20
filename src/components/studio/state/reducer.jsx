import { initialState } from "./initialState";

export function studioReducer(state, action) {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.tab };

    case "UPLOAD_START":
      return { ...state, uploadLoading: true, uploadError: null };
    case "UPLOAD_SUCCESS":
      return { 
        ...state, 
        uploadLoading: false, 
        imageUrl: action.imageUrl,
        imageId: action.imageId,
        imageName: action.imageName
      };
    case "UPLOAD_ERROR":
      return { ...state, uploadLoading: false, uploadError: action.error };

    case "SET_IMAGE_URL":
      return { ...state, imageUrl: action.url };

    case "ADD_HOTSPOT":
      return { ...state, hotspots: [...state.hotspots, action.hotspot] };

    case "UPDATE_HOTSPOT":
      return {
        ...state,
        hotspots: state.hotspots.map(h =>
          h.id === action.hotspot.id ? action.hotspot : h
        ),
      };

    case "DELETE_HOTSPOT":
      return {
        ...state,
        hotspots: state.hotspots.filter(h => h.id !== action.id),
        selectedHotspotId:
          state.selectedHotspotId === action.id ? null : state.selectedHotspotId,
      };

    case "SELECT_HOTSPOT":
      return { ...state, selectedHotspotId: action.id };

    case "HOTSPOT_MOVE":
      return {
        ...state,
        hotspots: state.hotspots.map(h =>
          h.id === action.id
            ? { ...h, x: action.x, y: action.y }
            : h
        ),
      };

    case "FINALIZE_START":
      return { ...state, finalizeLoading: true, finalizeError: null };

    case "FINALIZE_SUCCESS":
      return {
        ...state,
        finalizeLoading: false,
        lastFinalizedLogId: action.logId,
        lastFinalizedHash: action.hash,
        lastFinalizedImageFileHash: action.imageFileHash,
        lastFinalizedCreatedAt: action.createdAt
      };

    case "FINALIZE_ERROR":
      return { ...state, finalizeLoading: false, finalizeError: action.error };

    case "VERIFY_START":
      return {
        ...state,
        verifyLoading: true,
        verifyError: null,
        verifyResult: null,
      };

    case "VERIFY_SUCCESS":
      return { ...state, verifyLoading: false, verifyResult: action.result };

    case "VERIFY_ERROR":
      return { ...state, verifyLoading: false, verifyError: action.error };

    case "RESET_EDITOR":
      return initialState;

    case "RESET_HOTSPOTS":
      return { ...state, hotspots: [], selectedHotspotId: null };

    case "RESET_IMAGE":
      return { ...state, imageUrl: null, imageId: null, imageName: null };

    default:
      return state;
  }
}