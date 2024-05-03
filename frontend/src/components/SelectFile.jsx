import * as React from 'react';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import Add from '@mui/icons-material/Add';
import { useContext } from 'react';
import { api, changeText } from '../utils/Utils';
import { useEffect } from 'react';
import SnackbarWithDecorators from '../utils/SnackbarWithDecorators';

export default function SelectFile({open, setOpen, xlsxFile, setXlsxFile, snackAlert, setSnackAlert, snackbarProperty, setSnackbarProperty, loading, setLoading}) {
    const OnSubmit = () => {
        setLoading(true);
        api(`api/v1/xlsx`, "post", {'file': xlsxFile}, true)
        .then((res) => {
            setSnackbarProperty(prevState => ({
                ...prevState,
                text: res.data,
                color: "success"
              }));
            setSnackAlert(true);
        })
        .catch((e) => {
            console.log('error', e);
            setSnackbarProperty(prevState => ({
                ...prevState,
                text: e,
                color: "danger"
              }));
            setSnackAlert(true);
        })
        .finally(() => {
            setLoading(false);
        });
    }
  return (
    <React.Fragment>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Select file to upload</DialogTitle>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              setOpen(false);
            }}
          >
            <Stack spacing={2}>
              <FormControl>
                <FormLabel>Select file</FormLabel>
                <input type="file" name="xlsxFile" onChange={(e) => {setXlsxFile(e.target.files[0])}} />
              </FormControl>
              <Button type="submit" onClick={OnSubmit}>Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
