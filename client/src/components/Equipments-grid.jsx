import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EquipmentPreview from "./Equipment-preview";
import EquipmentCreation from "./Equipment-creation";
import useEth from "../contexts/EthContext/useEth";

import { equipments, equipmentsDetails } from "./Mock-data";



function EquipmentsGrid() {
	const { state: { isProducer } } = useEth();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);

    return (
        
        <Stack spacing={2}>
            <Grid container spacing={2} alignItems="center">

                {equipments.map((equipment) => {

                    const id = equipment.id;
                    const eqDetails = equipmentsDetails.find( eq => eq.equipmentId === id);

                    return (
                        <Grid key={id} xs={12} sm={6} md={3} lg={2}>

                            <Link to={"/equipment/" + id}  style={{ textDecoration: 'none' }}>
                                <EquipmentPreview
                                manufacturer={equipment.manufacturer}
                                category={equipment.category}
                                owner={eqDetails.owner}
                                description={eqDetails.description}
                                img={eqDetails.photo} />
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
            />

        </Stack>
    )
}

export default EquipmentsGrid;