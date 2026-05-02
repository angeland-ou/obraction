import React, { useState } from 'react';
import { getDocumentUrl } from '../api/documents';

const DocumentItem = ({ document }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isPdf = document.mimeType === 'application/pdf';
    const icon = isPdf ? 'docs' : 'image';

    const handleOpen = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await getDocumentUrl(document.id);
            window.open(response.data?.url, '_blank', 'noreferrer');
        } catch {
            setError('No se pudo abrir el documento');
        } finally {
            setLoading(false);
        }
    };

    const formatSize = (bytes) => {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="document-badge clickable" onClick={handleOpen}>
            <div className="document-badge-icon" style={{ backgroundColor: 'var(--primary)' }}>
                <span className="material-symbols-rounded">{icon}</span>
            </div>
            <div className="document-badge-info">
                <span className="document-badge-name">{document.originalName}</span>
                {document.sizeBytes && (
                    <span className="document-badge-size">{formatSize(document.sizeBytes)}</span>
                )}
                {error && <span className="error-message">{error}</span>}
            </div>
            <button
                className="document-badge-link"
                onClick={handleOpen}
                disabled={loading}
                title="Abrir documento"
            >
                <span className="material-symbols-rounded">
                    {loading ? 'sync' : 'open_in_new'}
                </span>
            </button>
        </div>
    );
};

export default DocumentItem;