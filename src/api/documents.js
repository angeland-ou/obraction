import { getRequest, deleteRequest} from "./http";

export const getDocumentUrl = (documentId) => getRequest(`/documents/${documentId}/url`);
export const deleteDocument    = (documentId) => deleteRequest(`/documents/${documentId}`);
