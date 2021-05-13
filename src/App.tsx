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
import { SmileBASICFile } from "@sbapi-team/smilebasic-fileparser";
import FileInfoCard from "./FileInfoCard";

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
          <Box my={4}>
            <FileInfoCard file={currentFile} />
          </Box>
        )}
        <Box my={4}>
          <UploadCard id="fileupload" onUpload={handleUpload} />
        </Box>
      </Container>
    </>
  );
}

export default App;
