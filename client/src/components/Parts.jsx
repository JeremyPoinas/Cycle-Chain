import { useState } from "react";
import { Divider, Modal, Stack, Button, Typography, Box, TextField } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useEth from "../contexts/EthContext/useEth";
import { PartsTable } from "./Parts-list";
import { parts } from "./Mock-data";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Portfolio() {
  const { state: { contract, accounts } } = useEth();
  const [partToAdd, setPartToAdd] = useState({
    partId: '',
    type: '',
    reference: '',
    producerAddress: '',
    img: '',
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePartToAddChange = (e) => {
    switch (e.target.id) {
      case 'producerAddress':
        setPartToAdd({...partToAdd, producerAddress: e.target.value });
        break;
      case 'partType':
        setPartToAdd({...partToAdd, type: e.target.value });
        break;
      case 'reference':
        setPartToAdd({...partToAdd, reference: e.target.value });
        break;
      case 'partId':
        setPartToAdd({...partToAdd, partId: e.target.value });
        break;
      case 'img':
        setPartToAdd({...partToAdd, img: e.target.value });
        break;
      default:
    }
  };

  // Add a new proposal and update the proposals state
  const createPart = async () => {
    if (partToAdd.producerAddress === '' || partToAdd.type === '' || partToAdd.reference === '' || partToAdd.partId === '' || partToAdd.img === '') {
      alert('Please fill all the fields.');
    } else {
      const partURI = `{
        "serialNumber": "${partToAdd.partId}",
        "type": "${partToAdd.type}",
        "reference": "${partToAdd.reference}",
        "producerAddress": "${partToAdd.producerAddress}",
        "img": "${partToAdd.img}",
      }`;
      
      try {
        await contract.methods.createPart(partToAdd.producerAddress, partURI).call({ from: accounts[0] });
        await contract.methods.createPart(partToAdd.producerAddress, partURI).send({ from: accounts[0] });
        setOpen(false);
        alert('all good');
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
      <Box sx={{ width: '100%', maxWidth: 2000, p:5 }}>

          <Box sx={{ m:5 }} alignItems="center">
            <Button variant="contained" onClick={handleOpen} endIcon={<AddCircleIcon />}>Create a new Part</Button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
                  Please enter the part information:
                </Typography>
                <Stack spacing={2} direction="column" alignItems="center">
                  <TextField 
                    id="producerAddress"
                    label="Producer address"
                    variant="outlined"
                    value={partToAdd.producerAddress}
                    onChange={handlePartToAddChange}
                    helperText="Enter a Polygon address"
                    required
                  />
                  <TextField 
                    id="partType"
                    label="Part Type"
                    variant="outlined"
                    value={partToAdd.type}
                    onChange={handlePartToAddChange}
                    required
                  />
                  <TextField 
                    id="reference"
                    label="Part Reference"
                    variant="outlined"
                    value={partToAdd.reference}
                    onChange={handlePartToAddChange}
                    required
                  />
                  <TextField 
                    id="partId"
                    label="Part serial number"
                    variant="outlined"
                    value={partToAdd.partId}
                    onChange={handlePartToAddChange}
                    required
                  />
                  <label for="img">Choose the part's image:</label>
                  <input type="file" id="img" onChange={handlePartToAddChange} required></input>
                  <Button variant="contained" onClick={createPart}>Create</Button>
                </Stack>
              </Box>
            </Modal>
          </Box>

          <Divider />

          <Box sx={{ m:5 }}>
              <Typography variant="h4" gutterBottom>Parts produced</Typography>
              <PartsTable parts={parts}/>
          </Box>
      </Box>
          
  )
}

