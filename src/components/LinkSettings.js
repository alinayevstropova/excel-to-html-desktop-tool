import React from "react";
import { Delete as DeleteIcon } from "@mui/icons-material";
import {
  TextField,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography, // VERY IMPORTANT
} from "@mui/material";

function LinkSettings({ linkSettings, onChange }) {
  const handleAddWord = () => {
    onChange("words", [...linkSettings.words, ""]);
  };

  const handleWordChange = (index, value) => {
    const newWords = linkSettings.words.map((word, i) =>
      i === index ? value : word
    );
    onChange("words", newWords);
  };

  const handleRemoveWord = (index) => {
    const newWords = linkSettings.words.filter((_, i) => i !== index);
    onChange("words", newWords);
  };

  return (
    <Box className="linkSettings">
       <h2 className="linkTitle">Настройки ссылок</h2>
     <div className="linkSettings_fields"><TextField
        label="Link Class"
        value={linkSettings.linkClass}
        onChange={(e) => onChange("linkClass", e.target.value)}
        fullWidth
        margin="normal"
      />
      <Typography variant="subtitle1">Words for Links:</Typography>
      <List>
        {linkSettings.words.map((word, index) => (
          <ListItem key={index}>
            <TextField
              label={`Word ${index + 1}`}
              value={word}
              onChange={(e) => handleWordChange(index, e.target.value)}
              fullWidth
              margin="normal"
            />
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleRemoveWord(index)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button variant="contained" color="primary" onClick={handleAddWord}>
        Add Word
      </Button></div> 
    </Box>
  );
}

export default LinkSettings;
