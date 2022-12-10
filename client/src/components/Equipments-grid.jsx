import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EquipmentPreview from "./Equipment-preview";
import EquipmentCreation from "./Equipment-creation";
import useEth from "../contexts/EthContext/useEth";



function EquipmentsGrid() {
	const { state: { contract, accounts, isProducer } } = useEth();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
    const [equipments, setEquipments] = useState([]);

    // Get all equipments and update the associated state
    const getEquipments = async () => {
        try {
            let allEquipments = await contract?.methods.getAllEquipments().call({ from: accounts[0] });
            allEquipments = allEquipments?.filter(equipment => equipment.owner === accounts[0]);
            if (allEquipments) setEquipments(allEquipments);
        } catch (err) {
            alert(err); 
        }
    };

    useEffect(() => {
        getEquipments();
    }, [accounts, contract]);

    return (
        
        <Stack spacing={2}>
            <Grid container spacing={2} alignItems="center">

                {equipments.map((equipment) => {

                    const id = equipment.serialNumber;

                    return (
                        <Grid key={id} xs={12} sm={6} md={3} lg={2}>

                            <Link to={"/equipment/" + id}  style={{ textDecoration: 'none' }}>
                                <EquipmentPreview
                                manufacturer={equipment.manufacturer}
                                category={equipment.category}
                                owner={equipment.owner}/>
                            </Link>

                        </Grid>
                    )
                })}
            </Grid>
            {isProducer && 
                <Button variant="contained" onClick={handleOpen} endIcon={<AddCircleIcon />} sx={{ width: "220px" }}>
                    Add an equipment
                </Button>
            }
    
            <EquipmentCreation
                open={open}
                setOpen={setOpen}
                getEquipments={getEquipments}
            />

        </Stack>
    )
}

export default EquipmentsGrid;