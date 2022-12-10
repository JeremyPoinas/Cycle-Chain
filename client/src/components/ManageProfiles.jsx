import { useState } from "react";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import useEth from "../contexts/EthContext/useEth";

const ManageProfiles = () => {
  const { state: { contract, accounts } } = useEth();
  const [producerToAdd, setProducerToAdd] = useState("");
  const [producerToRemove, setProducerToRemove] = useState("");
  
  const handleAddProducerAddressChange = e => {
    setProducerToAdd(e.target.value);
  };

  // Register a new producer(NFT Creator) and set the associated state variable
  const addProducer = async () => {
    try {
      await contract.methods.registerEquipmentManufacturer(producerToAdd).call({ from: accounts[0] });
      await contract.methods.registerEquipmentManufacturer(producerToAdd).send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };
  
  const handleRemoveProducerAddressChange = e => {
    setProducerToRemove(e.target.value);
  };

  // Remove a producer(NFT Creator) and set the associated state variable
  const removeProducer = async () => {
    try {
      await contract.methods.removeEquipmentManufacturer(producerToRemove).call({ from: accounts[0] });
      await contract.methods.removeEquipmentManufacturer(producerToRemove).send({ from: accounts[0] });
    } catch (err) {
      alert(err);
    }
  };

  return(
    <Grid container spacing={2} direction="column" justifyContent="space-between" alignItems="center">
      <Stack spacing={2} direction="row" sx={{ margin: 10 }}>
        <Button variant="contained" onClick={addProducer}>Add an Equipment Manufacturer</Button>
        <TextField 
          id="outlined-basic"
          label="Type address.."
          variant="outlined"
          value={producerToAdd}
          onChange={handleAddProducerAddressChange}
        />
      </Stack>
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={removeProducer}>Remove an Equipment Manufacturer</Button>
        <TextField 
          id="outlined-basic"
          label="Type address.."
          variant="outlined"
          value={producerToRemove}
          onChange={handleRemoveProducerAddressChange}
        />
      </Stack>
    </Grid>
  );
};

export default ManageProfiles;
