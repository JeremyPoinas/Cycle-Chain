import { useState, useEffect } from "react";
import { Divider, Modal, Stack, Button, Typography, Box, TextField } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import useEth from "../contexts/EthContext/useEth";
import { PartsTable } from "./Parts-list";
//import { parts } from "./Mock-data";

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
    model: '',
    producerAddress: '',
    category: '',
  });


  // ::::::::::::::: GET MINTED PARTS :::::::::::::::

  const [mintedParts, setMintedParts] = useState([]);

  const getMintedParts = async () => {
    try {
      let numberOfParts = await contract?.methods._tokenIds().call({ from: accounts[0] });
      let mintedPartsArray = [];

      for (let i=1; i<= numberOfParts; i++) {
        let uri = await contract?.methods.tokenURI(i).call({ from: accounts[0] });
        if (uri) {
          const uriObject = JSON.parse(uri);
            if(uriObject.minterAddress == accounts[0]) {
              mintedPartsArray.push(uriObject);
            }
        } 
      }
      setMintedParts(mintedPartsArray);

    } catch (err) { alert(err); }
  };

  useEffect(() => {
    getMintedParts();
  }, [accounts, contract]);






  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePartToAddChange = (e) => {
    switch (e.target.id) {
      case 'producerAddress':
        setPartToAdd({...partToAdd, producerAddress: e.target.value });
        break;
      case 'category':
        setPartToAdd({...partToAdd, category: e.target.value });
        break;
      case 'model':
        setPartToAdd({...partToAdd, model: e.target.value });
        break;
      case 'partId':
        setPartToAdd({...partToAdd, partId: e.target.value });
        break;
      default:
    }
  };

  // Add a new proposal and update the proposals state
  const createPart = async () => {
    if (partToAdd.producerAddress === '' || partToAdd.category === '' || partToAdd.model === '' || partToAdd.partId === '') {
      alert('Please fill all the fields.');
    } else {
      const partURI = `{
        "serialNumber": "${partToAdd.partId}",
        "category": "${partToAdd.category}",
        "model": "${partToAdd.model}",
        "producerAddress": "${partToAdd.producerAddress}",
        "minterAddress": "${accounts[0]}"
      }`;
      
      try {
        await contract.methods.createPart(partToAdd.producerAddress, partURI).call({ from: accounts[0] });
        await contract.methods.createPart(partToAdd.producerAddress, partURI).send({ from: accounts[0] });
        setOpen(false);
        getMintedParts();
        setPartToAdd({
          partId: '',
          model: '',
          producerAddress: '',
          category: '',
        });
      } catch (err) {
        alert(err);
      }
    }
  };

  return (
      <Stack spacing={2} padding={5}>

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
                id="category"
                label="Part Category"
                variant="outlined"
                value={partToAdd.category}
                onChange={handlePartToAddChange}
                required
              />
              <TextField 
                id="model"
                label="Part model"
                variant="outlined"
                value={partToAdd.model}
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
              <Button variant="contained" onClick={createPart}>Create</Button>
            </Stack>
          </Box>
        </Modal>


        <Typography variant="h4" gutterBottom>Parts produced</Typography>

        <PartsTable parts={mintedParts}/>

        <Stack direction="row">
          <Button variant="contained" onClick={handleOpen} endIcon={<AddCircleIcon />}>Create a new Part</Button>
        </Stack>
              
      </Stack>
          
  )
}

