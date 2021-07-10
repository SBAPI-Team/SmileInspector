import {
  Button,
  Card,
  CardContent,
  createStyles,
  List,
  ListItem,
  makeStyles,
  Typography,
} from "@material-ui/core";
import {
  SmileBASICFile,
  SmileBASICFileType,
} from "@sbapi-team/smilebasic-fileparser";
import DescriptionIcon from "@material-ui/icons/Description";
import AssessmentIcon from "@material-ui/icons/Assessment";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import ImageIcon from "@material-ui/icons/Image";
import PersonIcon from "@material-ui/icons/Person";
import SaveIcon from "@material-ui/icons/Save";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import React from "react";
import {
  FileConverter,
  GetSupportedFileConverters,
} from "@sbapi-team/sbapi-file-conversions";
import { useState } from "react";
import { useEffect } from "react";
import FileSaver from "file-saver";

const FileTypeIconMap = {
  [SmileBASICFileType.Text]: DescriptionIcon,
  [SmileBASICFileType.Data]: AssessmentIcon,
  [SmileBASICFileType.Project3]: FolderOpenIcon,
  [SmileBASICFileType.Project4]: FolderOpenIcon,
  [SmileBASICFileType.Meta]: PermMediaIcon,
  [SmileBASICFileType.Jpeg]: ImageIcon,
};

const FileTypeDescriptionMap = {
  [SmileBASICFileType.Text]: "Text file",
  [SmileBASICFileType.Data]: "Data file",
  [SmileBASICFileType.Project3]: "Project (SmileBASIC 3)",
  [SmileBASICFileType.Project4]: "Project (SmileBASIC 4)",
  [SmileBASICFileType.Meta]: "Project Metadata",
  [SmileBASICFileType.Jpeg]: "JPEG image",
};

const useStyles = makeStyles((theme) => ({
  listIcon: {
    marginRight: theme.spacing(2),
  },
}));

async function convertAndDownload(
  converter: FileConverter,
  file: SmileBASICFile
) {
  const buffer = await converter.ConvertFile(file, { nice: true });
  const blob = new Blob([buffer], { type: converter.ReturnedMimeType });

  FileSaver.saveAs(blob, "download");
}

const ConvertButton = ({
  converter,
  file,
}: {
  converter: FileConverter;
  file: SmileBASICFile;
}) => {
  return (
    <Button onClick={() => convertAndDownload(converter, file)}>
      {converter.ShortName}
    </Button>
  );
};

const FileInfoCard = ({ file }: { file: SmileBASICFile }) => {
  const styles = useStyles();
  const FileIcon = FileTypeIconMap?.[file.Type!];
  const [fileConverters, setFileConverters] = useState<FileConverter[]>();

  useEffect(() => {
    GetSupportedFileConverters(file)
      .then((converters) => {
        setFileConverters(converters);
      })
      .catch((e) => {
        alert(e.stack);
      });
  }, [file]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">File information:</Typography>
        <br />
        <List component="nav">
          <ListItem>
            <FileIcon className={styles.listIcon} />
            <Typography>{FileTypeDescriptionMap[file.Type!]}</Typography>
          </ListItem>
          <ListItem>
            <PersonIcon className={styles.listIcon} />
            <Typography title={`User ID ${file.Header.Editor.UID}`}>
              {file.Header.Editor.Username}
            </Typography>
          </ListItem>
          <ListItem>
            <SaveIcon className={styles.listIcon} />
            <Typography>
              {`${file.RawContent.length.toLocaleString()} bytes`}
            </Typography>
          </ListItem>
          <ListItem>
            <CalendarTodayIcon className={styles.listIcon} />
            <Typography>{`${file.Header.LastModified.toLocaleString()}`}</Typography>
          </ListItem>
          <ListItem>
            <FileCopyIcon className={styles.listIcon} />
            <Typography>
              {fileConverters == null
                ? "Loading..."
                : fileConverters.map((converter) => (
                    <ConvertButton file={file} converter={converter} />
                  ))}
            </Typography>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default FileInfoCard;
