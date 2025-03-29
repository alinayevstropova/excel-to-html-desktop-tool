import React, { useState, useRef } from 'react';
import {
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
    Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const DragDropArea = styled(Paper)({
    padding: '20px',
    textAlign: 'center',
    border: '2px dashed #aaa',
    cursor: 'pointer',
    '&.hover': {
        backgroundColor: '#e9f2ff',
        borderColor: '#007bff',
    },
});

const FileSelector = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState({ excel: null, zip: null });
    const [isDragOver, setIsDragOver] = useState(false);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            handleFileSelect(event.target.files[0]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragOver(false);
        if (event.dataTransfer.files.length > 0) {
            handleFileSelect(event.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (file) => {
        if (!file) return;

        if (file.name.endsWith('.zip')) {
            if (selectedFiles.zip) return; // Если уже выбран ZIP, игнорируем
            setSelectedFiles((prev) => ({ ...prev, zip: file }));
        } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            if (selectedFiles.excel) return; // Если уже выбран Excel, игнорируем
            setSelectedFiles((prev) => ({ ...prev, excel: file }));
        }

        onFileSelect(file);
    };

    const removeFile = (type) => {
        setSelectedFiles((prev) => ({ ...prev, [type]: null }));
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Выберите файлы (1 ZIP, 1 Excel)
            </Typography>
            <DragDropArea
                className={`drag-drop-area ${isDragOver ? 'hover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleButtonClick}
            >
                <CloudUploadIcon fontSize="large" color="rgb(0 0 0)" />
                <Typography variant="body2">
                    Перетащите файл сюда или нажмите, чтобы выбрать
                </Typography>
            </DragDropArea>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
            {(selectedFiles.excel || selectedFiles.zip) && (
                <Paper elevation={3} style={{ marginTop: '20px' }}>
                    <List>
                        {selectedFiles.excel && (
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => removeFile('excel')}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={`Excel: ${selectedFiles.excel.name}`} />
                            </ListItem>
                        )}
                        {selectedFiles.zip && (
                            <ListItem
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => removeFile('zip')}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={`ZIP: ${selectedFiles.zip.name}`} />
                            </ListItem>
                        )}
                    </List>
                </Paper>
            )}
        </Box>
    );
};

export default FileSelector;
