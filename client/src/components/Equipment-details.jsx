import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Card, CardMedia, Divider, Modal, Box, TextField, MenuItem } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Typography from "@mui/material/Typography";
import { EquipmentOperationsList } from "./Operations-list";
import {PartsTable} from "./Parts-list";
import useEth from "../contexts/EthContext/useEth";

import { parts, equipments, equipmentsDetails, operations, assemblies } from "./Mock-data";



function EquipmentSummary({equipmentId}) {

    const equipment = equipments.find(eq => eq.id === equipmentId);
    const equipmentDetails = equipmentsDetails.find( eq => eq.equipmentId === equipmentId);

    return (
        <Stack direction="row" spacing={2}>

            <Card sx={{maxWidth: 300}}>
                <CardMedia
                    component="img"
                    height="200"
                    image= {equipmentDetails.photo}
                    alt="équipement"
                />
            </Card>


            <Stack>
                <Typography variant="h4">
                    {equipment.category + " " + equipment.manufacturer}
                </Typography>

                <Typography variant="body" color="text.secondary">
                    Catégorie : {equipment.category}<br></br>
                    Fabricant : {equipment.manufacturer}<br></br>
                    Modèle : {equipment.model}<br></br>
                    Numéro de série : {equipment.id}<br></br>
                    Détails : {equipmentDetails.description}
                </Typography>
            </Stack>

        </Stack>

    )
}

function EquipmentOperations({equipmentId}) {

    const ops = operations.filter(op => op.equipmentId === equipmentId);

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Opérations</Typography>
            <EquipmentOperationsList operations={ops}/>
        </Stack>
    )
}

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

function InstallModal({ open, setOpen, equipmentId }) {
	const { state: { contract, accounts } } = useEth();
	const [part, setPart] = useState('');
	const handleClose = () => setOpen(false);


	const handleInstallPart = async() => {
        try {
        await contract.methods.installPartOnEquipment(part.id, equipmentId).call({ from: accounts[0] });
        await contract.methods.installPartOnEquipment(part.id, equipmentId).send({ from: accounts[0] });
        } catch (err) {
        alert(err);
        }
    };

	const handlePartChange = (e) => {
		setPart(e.target.value);
	};

	return(
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle}>
				<Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
					Please select the part you want to install on this equipment:
				</Typography>
				<Stack spacing={2} direction="column" alignItems="center">
					<TextField 
						id="part"
                        select
						label="Part to select"
						variant="outlined"
						value={part}
						onChange={handlePartChange}
						required
                        sx={{width: "100%"}}
					>
                        {parts.map((part) => (
                            <MenuItem key={part.id} value={part.id}>
                                {part.id} - {part.category} - {part.reference}
                            </MenuItem>
                        ))}
                    </TextField>
					<Button variant="contained" onClick={handleInstallPart}>Confirm</Button>
				</Stack>
			</Box>
		</Modal>
    )
}

function Parts({equipmentId}) {
	const { state: { contract, accounts } } = useEth();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);

    const partsIds = assemblies.find(assem => assem.equipmentId === equipmentId).parts;
    const partsArray = parts.filter( p => partsIds.includes(p.id) )

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Pièces certifiées</Typography>
            <Stack spacing={2}> 
                <PartsTable parts={partsArray} />
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleOpen} endIcon={<AddCircleIcon />}>Install a part</Button>
                    <InstallModal
                        open={open}
                        setOpen={setOpen}
                        equipmentId={equipmentId}
                    ></InstallModal>
                    <Link to="/parts-buying" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" endIcon={<ShoppingCartIcon />}>Buy a part</Button>
                    </Link>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default function EquipmentDetails() {

    let { equipmentId } = useParams();

    return (
        <Stack p={5} spacing={5}>

            <EquipmentSummary equipmentId={equipmentId}/>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
                <EquipmentOperations equipmentId={equipmentId}/>
                <Parts equipmentId={equipmentId}/>
            </Stack>

        </Stack>
    )
}