import React, { useState, useCallback } from "react";
import FileSelector from "./components/FileSelector";
import Settings from "./components/Settings";
import LinkSettings from "./components/LinkSettings";
import FormSelector from "./components/FormSelector";
import Preview from "./components/Preview";
import Output from "./components/Output";
import {
  parseExcel,
  extractDataFromSheet,
  settings,
} from "./services/excelService";
import { processZip } from "./services/zipService";
import { formatData } from "./services/formatService";
import {
  LinearProgress,
  Alert,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material"; //  Import Paper and Button
import { styled } from "@mui/material/styles";

const MainContainer = styled("div")({});

const FileSection = styled("div")({});
const RightSection = styled("div")({});
const SettingsSection = styled("div")({});

const PreviewSection = styled("div")({});

const ProgressBarContainer = styled("div")({});

function App() {
  const [settings, setSettings] = useState({
    headerTag: "h2",
    headerClass: "",
    textTag: "p",
    textClass: "",
  });

  const [linkSettings, setLinkSettings] = useState({
    linkClass: "",
    words: [],
  });
  console.log("Initial linkSettings:", linkSettings);
  const [selectedForm, setSelectedForm] = useState("form1");
  const [formattedContent, setFormattedContent] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelFileName, setExcelFileName] = useState("");
  const [zipFileName, setZipFileName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleExcelFileSelect = useCallback(
    async (file) => {
      setProcessing(true);
      setProgress(5);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        if (file) {
          setExcelFile(file);
          setExcelFileName(file.name);
          setProgress(30);

          // Передаем путь к файлу, если работаем в Electron
          const readFileAsArrayBuffer = (file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = (event) => resolve(event.target.result);
              reader.onerror = (error) => reject(error);
              reader.readAsArrayBuffer(file);
            });
          };

          const fileData = await readFileAsArrayBuffer(file);
          const data = await parseExcel(fileData);
          setProgress(60);

          let processedData = "";
          if (Array.isArray(data)) {
            processedData = data
              .map((sheet) => extractDataFromSheet(sheet, settings))
              .flat();
          }

          setFormattedContent(
            processedData.length > 0
              ? formatData(processedData, settings, linkSettings, selectedForm)
              : ""
          );
          setProgress(100);
        }
      } catch (error) {
        console.error("Ошибка при обработке Excel файла:", error);
        setErrorMessage(
          error.message || "Произошла ошибка при обработке Excel файла."
        );
        setProgress(0);
      } finally {
        setProcessing(false);
      }
    },
    [settings, linkSettings, selectedForm]
  );

  const handleZipFileSelect = useCallback(async (file) => {
    setProcessing(true);
    setProgress(5);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (file) {
        setZipFile(file);
        setZipFileName(file.name);
        setProgress(100);
      }
    } catch (error) {
      console.error("Ошибка при обработке ZIP файла:", error);
      setErrorMessage(
        error.message || "Произошла ошибка при обработке ZIP файла."
      );
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  });

  const handleSaveZip = useCallback(async () => {
    setProcessing(true);
    setProgress(5);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setProgress(30);
      let filePath = null;
      if (window.electron && window.electron.showSaveDialog) {
        const saveDialogResult = await window.electron.showSaveDialog({
          filters: [{ name: "ZIP Files", extensions: ["zip"] }],
        });
        filePath = saveDialogResult ? saveDialogResult.filePath : null;
      } else {
        throw new Error(
          "Electron functions not available in this environment."
        );
      }

      setProgress(60);

      if (filePath) {
        // Вам может потребоваться прочитать содержимое zipFile здесь,
        // если processZip ожидает путь к файлу, а не сам файл.
        // Пример:
        // const zipFileData = await readFileData(zipFile);
        // const tempZipPath = await processZip(zipFileData, formattedContent);
        let tempZipPath = zipFile
          ? await processZip(zipFile, formattedContent)
          : null;
        setProgress(80);

        if (tempZipPath) {
          if (window.electron && window.electron.saveZip) {
            await window.electron.saveZip({
              filePath: filePath,
              htmlContent: formattedContent,
              existingZip: tempZipPath,
            });
          } else {
            throw new Error(
              "Electron functions not available in this environment."
            );
          }
        } else {
          if (window.electron && window.electron.saveZip) {
            await window.electron.saveZip({
              filePath: filePath,
              htmlContent: formattedContent,
              existingZip: false,
            });
          } else {
            throw new Error(
              "Electron functions not available in this environment."
            );
          }
        }
        setSuccessMessage("ZIP файл успешно сохранен.");
      }
      setProgress(100);
    } catch (error) {
      console.error("Ошибка при сохранении ZIP:", error);
      setErrorMessage(error.message || "Ошибка при сохранении ZIP файла.");
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  }, [zipFile, formattedContent]);

  const handleInsertText = useCallback(async () => {
    setProcessing(true);
    setProgress(5);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Вам может потребоваться прочитать содержимое zipFile здесь
      // если processZip ожидает путь к файлу, а не сам файл.
      // Пример:
      // const zipFileData = await readFileData(zipFile);
      // await processZip(zipFileData, formattedContent);
      if (zipFile) {
        await processZip(zipFile, formattedContent);
        setSuccessMessage("Текст успешно вставлен в ZIP.");
      }
      setProgress(100);
    } catch (error) {
      console.error("Error insert text:", error);
      setErrorMessage(error.message || "Ошибка при вставке текста.");
      setProgress(0);
    } finally {
      setProcessing(false);
    }
  }, [zipFile, formattedContent]);

  return (
    <MainContainer className="mainBack">
      <FileSection className="left">
        <Typography variant="h5" component="h1" gutterBottom>
          Форматирование данных
        </Typography>
        <FileSelector
          onFileSelect={(file) => {
            if (file.name.endsWith(".zip")) {
              handleZipFileSelect(file);
            } else if (
              file.name.endsWith(".xls") ||
              file.name.endsWith(".xlsx")
            ) {
              handleExcelFileSelect(file);
            }
          }}
        />
      </FileSection>
      <RightSection className="right">
        <SettingsSection>
          <Settings
            settings={settings}
            onChange={(key, value) =>
              setSettings((prev) => ({ ...prev, [key]: value }))
            }
          />
          <LinkSettings
          
            linkSettings={linkSettings}
            onChange={(key, value) =>
              setLinkSettings((prev) => ({ ...prev, [key]: value }))
            }
          />
          <FormSelector
            selectedForm={selectedForm}
            onChange={(key, value) => setSelectedForm(value)}
          />
        </SettingsSection>

        <PreviewSection>
          <Preview formattedContent={formattedContent} />
          <Output
            outputText={formattedContent}
            onInsertText={handleInsertText}
          />
          <Box mt={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveZip}
              disabled={processing}
            >
              Сохранить в ZIP
            </Button>
          </Box>
        </PreviewSection>
      </RightSection>
      {processing && (
        <ProgressBarContainer>
          <LinearProgress variant="determinate" value={progress} />
        </ProgressBarContainer>
      )}
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}
    </MainContainer>
  );
}

export default App;
