// Set the backend URL from environment variables
const backendUrl = process.env.REACT_APP_BACKEND_URL;

/**
 * Fetch all documents from the backend.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of document objects.
 */
export const fetchDocuments = async () => {
  const response = await fetch(`${backendUrl}/documents`);
  const data = await response.json();
  return data.documents;
};

/**
 * Update the position of a specific document in the backend.
 *
 * @param {number} id - The ID of the document to update.
 * @param {number} position - The new position of the document.
 */
export const updateDocumentPosition = async (id, position) => {
  await fetch(`${backendUrl}/documents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ position }),
  });
};

/**
 * Add a new document to the backend.
 *
 * @param {string} type - The type of the document.
 * @param {string} title - The title of the document.
 * @param {number} position - The position of the document.
 * @returns {Promise<Object>} A promise that resolves to the added document object.
 */
export const addDocument = async (type, title, position) => {
  const response = await fetch(`${backendUrl}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type, title, position }),
  });
  const data = await response.json();
  return data;
};

/**
 * Delete a specific document from the backend.
 *
 * @param {number} id - The ID of the document to delete.
 */
export const deleteDocument = async (id) => {
  await fetch(`${backendUrl}/documents/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
