import React, { useRef } from 'react';
import './Styles/fileUploadStyles.scss'; // Import the CSS file
import { Toast } from "primereact/toast";

interface FileUploadDropzoneProps {
    label: string;
    subLabel?: string;
    acceptedFormats: string[];
    maxFiles: number;
    maxFileSize: number; // in MB
    files: File[];
    setFiles: React.Dispatch<React.SetStateAction<File[]>>;
    className?: string;
}

interface DualFileUploadProps {
    leftDropzone: FileUploadDropzoneProps;
    rightDropzone: FileUploadDropzoneProps;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
    label,
    subLabel,
    acceptedFormats,
    maxFiles,
    maxFileSize,
    files,
    setFiles,
    className = ""
}) => {
    const toastRef = useRef<Toast>(null);
    const failureToast = (message: string) => {
        toastRef.current?.show({ severity: 'error', summary: 'Error', detail: message, life: 5000 });
    }
    const successToast = (message: string) => {
        toastRef.current?.show({ severity: 'success', summary: 'Success', detail: message, life: 5000 });
    }

    const inputRef = useRef<HTMLInputElement>(null);

    // File validation
    const isValidFileType = (file: File): boolean => {
        const fileName = file.name.toLowerCase();
        return acceptedFormats.some(format => {
            if (format.startsWith('.')) {
                return fileName.endsWith(format.toLowerCase());
            } else {
                return file.type === format;
            }
        });
    };

    // Get file extension list for display
    // const getExtensionList = (): string => {
    //     return acceptedFormats
    //         .map(format => format.startsWith('.') ? format : '')
    //         .filter(Boolean)
    //         .join(', ');
    // };

    // Handle file drop/select
    const handleFiles = (fileList: FileList | File[]) => {
        const fileArray = Array.from(fileList);
        const validFiles: File[] = [];
        const duplicates: string[] = [];
        const invalidFiles: string[] = [];

        fileArray.forEach(file => {
            // Validate file type
            if (!isValidFileType(file)) {
                invalidFiles.push(file.name);
                return;
            }

            // Validate file size
            if (file.size > maxFileSize * 1024 * 1024) {
                invalidFiles.push(`${file.name} (too large)`);
                return;
            }

            // Check if we're at the limit
            if (files.length + validFiles.length >= maxFiles) {
                failureToast(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
                return;
            }

            // Check for duplicates
            const isDuplicate = files.some(existingFile =>
                existingFile.name === file.name && existingFile.size === file.size
            );

            if (isDuplicate) {
                duplicates.push(file.name);
                return;
            }

            validFiles.push(file);
        });

        // Show messages for invalid files
        if (invalidFiles.length > 0) {
            failureToast(`Invalid files: ${invalidFiles.join(', ')}`);
        }

        // Show messages for duplicates
        if (duplicates.length > 0) {
            failureToast(`Duplicate files skipped: ${duplicates.join(', ')}`);
        }

        // Add valid files
        if (validFiles.length > 0) {
            if (maxFiles === 1) {
                setFiles(validFiles);
            } else {
                setFiles(prev => [...prev, ...validFiles]);
            }
            successToast(`${validFiles.length} file${validFiles.length > 1 ? 's' : ''} uploaded successfully!`);
        }

        // Clear input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    // Delete file
    const deleteFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        successToast('File deleted successfully!');
    };

    // View file
    const viewFile = (file: File) => {
        const url = URL.createObjectURL(file);

        if (file.type === 'application/pdf') {
            window.open(url, '_blank');
        } else if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                const newWindow = window.open('', '_blank');
                if (newWindow) {
                    newWindow.document.write(`
            <html>
              <head><title>${file.name}</title></head>
              <body style="font-family: monospace; padding: 20px; white-space: pre-wrap;">
                ${content}
              </body>
            </html>
          `);
                    newWindow.document.close();
                }
            };
            reader.readAsText(file);
        } else {
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.click();
        }

        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    // Format file size
    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Drag and drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            handleFiles(droppedFiles);
        }
    };

    const acceptString = acceptedFormats.filter(format => format.startsWith('.')).join(',');

    return (
        <>
            <div className={`file-upload-dropzone-container ${className}`}>
                <div
                    className={`file-upload-dropzone ${files.length > 0 ? 'has-file' : ''}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {maxFiles > 1 && (
                        <div className={`file-counter ${files.length > 0 ? 'has-files' : ''}`}>
                            {files.length}/{maxFiles}
                        </div>
                    )}

                    {files.length === 0 && (
                        <div className="dropzone-content">
                            <div className="dropzone-label">
                                {label}
                            </div>
                            {subLabel && (
                                <div className="dropzone-sublabel">
                                    ({subLabel} {maxFiles > 1 ? ` - Max ${maxFiles} files` : ' - Single file only'})
                                </div>
                            )}
                            {/* <div className="dropzone-formats">
                                ({getExtensionList()} files accepted{maxFiles > 1 ? ` - Max ${maxFiles} files` : ' - Single file only'})
                            </div> */}
                            <div className="dropzone-size">
                                Max size: {maxFileSize}MB per file
                            </div>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        multiple={maxFiles > 1}
                        accept={acceptString}
                        className="file-input-hidden"
                        onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    />

                    <div className="files-list">
                        {files.map((file, index) => (
                            <div key={`${file.name}-${index}`} className="file-item">
                                <div className="file-meta">
                                    <div className="file-name" title={file.name}>
                                        {file.name}
                                    </div>
                                    <div className="file-size">
                                        {formatFileSize(file.size)}
                                    </div>
                                </div>
                                <div className="file-actions">
                                    <button
                                        className="dropZone-Button dropZone-Button-view"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            viewFile(file);
                                        }}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="dropZone-Button dropZone-Button-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteFile(index);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <Toast ref={toastRef} style={{ zIndex: 100000000000 }} />
        </>
    );
};

export const DualFileUpload: React.FC<DualFileUploadProps> = ({
    leftDropzone,
    rightDropzone
}) => {
    return (
        <div className="dual-file-upload-container">
            <div className="dual-file-upload-wrapper">
                <div className="dual-file-upload-section">
                    <FileUploadDropzone {...leftDropzone} />
                    <FileUploadDropzone {...rightDropzone} />
                </div>
            </div>
        </div>
    );
};