import React from "react";
import { useState, useEffect } from "react";
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
import grue1 from "../images/grue1.jpg";

import { operations } from "./Mock-data";



function EquipmentSummary({equipmentId}) {
	const { state: { contract, accounts } } = useEth();
    const [equipment, setEquipment] = useState([]);

    // Get one equipment and update the associated state
    const getEquipment = async () => {
        try {
            let oneEquipment = await contract?.methods.getOneEquipment(equipmentId).call({ from: accounts[0] });
            if (oneEquipment) setEquipment(oneEquipment);
        } catch (err) {
            alert(err); 
        }
    };

    useEffect(() => {
        getEquipment();
    }, [accounts, contract]);

    return (
        <Stack direction="row" justifyContent="space-between" spacing={2}>

            <Stack>
                <Typography variant="h4">
                    {equipment.category}
                </Typography>

                <Typography variant="body" color="text.secondary">
                    Fabricant : {equipment.manufacturer}<br></br>
                    Propriétaire : {equipment.owner}<br></br>
                    Modèle : {equipment.model}<br></br>
                    Numéro de série : {equipment.id}<br></br>
                </Typography>
            </Stack>


            <Card sx={{maxWidth: 300}}>
                <CardMedia
                    component="img"
                    height="200"
                    image= {grue1}
                    alt="équipement"
                />
            </Card>

        </Stack>

    )
}

/*
function EquipmentOperations({equipmentId}) {

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Opérations</Typography>
            <EquipmentOperationsList operations={operations}/>
        </Stack>
    )
}*/

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

function InstallModal({ open, setOpen, equipmentId, assembly }) {
	const { state: { contract, accounts } } = useEth();
	const [partId, setPartId] = useState(0);
	const handleClose = () => setOpen(false);
    const [partsNotInAssembly, setPartsNotInAssembly] = useState([]);

    const getPartsNotInAssembly = async () => {
        try {
            let numberOfParts = await contract?.methods._tokenIds().call({ from: accounts[0] });
            let parts= [];
            console.log(assembly, numberOfParts);
            for (let i=1; i<= numberOfParts; i++) {
                if (assembly === null || !assembly.partsIds.includes(i)) {
                    const partOwner = await contract?.methods.ownerOf(i).call({ from: accounts[0] });
                    if (partOwner === accounts[0]) {
                        const tokenURI = await contract?.methods.tokenURI(i).call({ from: accounts[0] });
                        const part = JSON.parse(tokenURI);
        
                        const partListingInfo = await contract?.methods.parts(i).call({ from: accounts[0] });
                        part.isListed = partListingInfo.isListed;
                        part.listedPrice = partListingInfo.listedPrice;
                        part.id = i;
        
                        parts.push(part);
                        console.log(part);
                    }
                }
            }
            setPartsNotInAssembly(parts);
        } catch (err) {
            alert(err); 
        }
    };

    useEffect(() => {
        getPartsNotInAssembly();
    }, [accounts, contract]);


	const handleInstallPart = async() => {
        try {
            await contract.methods.addPartToAssembly(equipmentId, partId).call({ from: accounts[0] });
            await contract.methods.addPartToAssembly(equipmentId, partId).call({ from: accounts[0] });
            setOpen(false);
        } catch (err) {
            alert(err);
        }
    };

	const handlePartChange = (e) => {
        console.log(e.target.value);
		setPartId(e.target.value);
        console.log(partId);
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
						value={partId}
						onChange={handlePartChange}
						required
                        sx={{width: "100%"}}
					>
                        {partsNotInAssembly.map((part) => (
                            <MenuItem key={part.id} value={part.id}>
                                {part.serialNumber} - {part.category} - {part.model}
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
    const [assembly, setAssembly] = useState(null);
    const [parts, setParts] = useState([]);

    const getParts = async () => {
        try {
            let oneAssembly = await contract?.methods.getOneAssembly(equipmentId).call({ from: accounts[0] });
            if (oneAssembly) {
                setAssembly(oneAssembly);
                const partIds = oneAssembly.partsIds;
                let parts= [];
                for (let i=1; i<= partIds.length; i++) {
                    const tokenURI = await contract?.methods.tokenURI(i).call({ from: accounts[0] });
                    const part = JSON.parse(tokenURI);

                    const partListingInfo = await contract?.methods.parts(i).call({ from: accounts[0] });
                    part.isListed = partListingInfo.isListed;
                    part.listedPrice = partListingInfo.listedPrice;

                    parts.push(part);
                }
                setParts(parts);
            }
        } catch (err) {
            alert(err); 
        }
    };

    useEffect(() => {
        getParts();
    }, [accounts, contract]);

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Pièces certifiées</Typography>
            <Stack spacing={2}> 
                <PartsTable parts={parts} />
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" onClick={handleOpen} endIcon={<AddCircleIcon />}>Install a part</Button>
                    <InstallModal
                        open={open}
                        setOpen={setOpen}
                        equipmentId={equipmentId}
                        parts={parts}
                        assembly={assembly}
                    ></InstallModal>
                    {/** 
                    <Link to="/explore" style={{ textDecoration: 'none' }}>
                        <Button variant="contained" endIcon={<ShoppingCartIcon />}>Buy a part</Button>
                    </Link>*/}
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
            <Parts equipmentId={equipmentId}/>
            {/*<Divider />*/}
            {/*<<EquipmentOperations equipmentId={equipmentId}/>*/}
            
        </Stack>
    )
}