import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function FormDialog({ open, handleClose, handleClickOpen, setupNewBroadcast }) {
  const [value, setValue] = useState("");

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Enter Broadcast Name</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            label="Broadcast Name"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => setupNewBroadcast(value)} color="primary">
            Create Channel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}