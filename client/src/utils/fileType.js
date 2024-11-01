const fileTypeMapping = {
    'text/plain': 'text',
    'application/pdf': 'pdf',
    'image/jpeg': 'image',
    'image/png': 'image',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
    'application/msword': 'word',
    'application/vnd.ms-excel': 'excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',

};

export const getFileCategory = (mimeType) => fileTypeMapping[mimeType] || null;
