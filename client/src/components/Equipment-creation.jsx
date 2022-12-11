import React from "react";
import { useState } from "react";
import { Button, Stack, TextField, Typography, Modal, Box } from "@mui/material";
import useEth from "../contexts/EthContext/useEth";

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

export default function EquipmentCreation({ open, setOpen, getEquipments }) {
	const { state: { contract, accounts } } = useEth();
	const [equipment, setEquipment] = useState({});
	const handleClose = () => setOpen(false);

    const handleCreateEquipment = async() => {
        try {
            await contract.methods.createEquipment(equipment.serialNumber, equipment.category, equipment.owner, equipment.model).call({ from: accounts[0] });
            await contract.methods.createEquipment(equipment.serialNumber, equipment.category, equipment.owner, equipment.model).send({ from: accounts[0] });
            setOpen(false);
            setEquipment({});
            getEquipments();
        } catch (err) {
            alert(err);
        }
    };

    const handleEquipmentChange = e => {
        switch (e.target.id) {
          case 'model':
            setEquipment({...equipment, model: e.target.value });
            break;
            case 'category':
              setEquipment({...equipment, category: e.target.value });
              break;
          case 'serialNumber':
            setEquipment({...equipment, serialNumber: e.target.value });
            break;
          case 'owner':
            setEquipment({...equipment, owner: e.target.value });
            break;
          default:
        }
    };

    return (
        <Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
            <Box sx={modalStyle}>

                
                <Typography variant="h6" component="h2" sx={{ marginBottom: 2 }}>Create an equipment</Typography>

                <Stack spacing={2} direction="column" alignItems="center">
                    <TextField required id="category" label="Category" onChange={handleEquipmentChange} />
                    <TextField required id="model" label="Model" onChange={handleEquipmentChange} />
                    <TextField required id="serialNumber" label="Serial number" onChange={handleEquipmentChange}/>
                    <TextField required id="owner" label="Owner" onChange={handleEquipmentChange}/>
                    <Button variant="contained" onClick={handleCreateEquipment}>Create</Button>
                </Stack>
            </Box>
        </Modal>
    )
}