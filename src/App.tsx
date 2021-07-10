import React, { FormEvent, useState } from "react";
import "./App.css";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import UploadCard from "./UploadCard";
import {
  SmileBASIC3ProjectFile,
  SmileBASIC4ProjectFile,
  SmileBASICFile,
  SmileBASICFileType,
} from "@sbapi-team/smilebasic-fileparser";
import FileInfoCard from "./FileInfoCard";

function SubFiles({
  file,
}: {
  file: SmileBASIC3ProjectFile | SmileBASIC4ProjectFile;
}) {
  console.log(file.Content.Files);
  let files: [name: string, file: SmileBASICFile][] = [];
  for (let name of file.Content.Files.keys()) {
    console.log(name);
    files.push([name, file.Content.Files.get(name)!]);
  }

  return (
    <Box my={4} ml={4}>
      {files &&
        files.map(([name, file]) => (
          <Box my={4} key={name}>
            <FileInfoCard file={file} name={name} />
          </Box>
        ))}
    </Box>
  );
}

function App() {
  const [currentFile, setCurrentFile] = useState<SmileBASICFile>();
  const [loading, setLoading] = useState<boolean>(false);

  const handleUpload = async (event: FormEvent<HTMLInputElement>) => {
    if (event.currentTarget.files?.[0]) {
      setLoading(true);
      const buffer = Buffer.from(
        await event.currentTarget.files[0].arrayBuffer()
      );

      const file = await (
        await SmileBASICFile.FromBuffer(buffer)
      ).ToActualType();
      setCurrentFile(file);
      setLoading(false);
    }
  };
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color={"default"} aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color={"textPrimary"}>
            SmileInspector
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        {currentFile != null && (
          <>
            <Box my={4}>
              <FileInfoCard file={currentFile} />
            </Box>
            {(currentFile.Type === SmileBASICFileType.Project3 ||
              currentFile.Type === SmileBASICFileType.Project4) && (
              <SubFiles
                file={
                  currentFile as SmileBASIC3ProjectFile | SmileBASIC4ProjectFile
                }
              />
            )}
          </>
        )}
        <Box my={4}>
          <UploadCard id="fileupload" onUpload={handleUpload} />
        </Box>
      </Container>
    </>
  );
}

export default App;
