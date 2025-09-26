export const fileTypes = { // based on mime type in multer
    image: 'image',
    video: 'video',
    audio: 'audio',
    document: 'document',
    application:"application",
}

export const allowedFileExtentions = {
    [fileTypes.image]: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    [fileTypes.video]: ['mp4', 'avi', 'mkv', 'mov', 'wmv'],
    [fileTypes.audio]: ['mp3', 'wav', 'aac', 'ogg', 'flac'],
    [fileTypes.document]: ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
    [fileTypes.application]: ['zip', 'rar', '7z', 'exe', 'msi'],
}