import { Button, Card, CardContent, Typography } from "@material-ui/core";
import React, { HTMLProps } from "react";

function FileUploadButton(props: HTMLProps<HTMLInputElement> & { id: string }) {
  return (
    <div>
      <input style={{ display: "none" }} type="file" {...props} />
      <label htmlFor={props.id}>
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
    </div>
  );
}

function UploadCard({
  id,
  onUpload,
}: {
  id: string;
  onUpload: React.FormEventHandler<HTMLInputElement>;
}) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">Load a file</Typography>
        <br />
        <FileUploadButton id={id} onChange={onUpload} />
      </CardContent>
    </Card>
  );
}

export default UploadCard;
