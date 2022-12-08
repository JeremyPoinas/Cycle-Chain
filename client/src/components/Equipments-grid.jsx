import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EquipmentPreview from "./Equipment-preview";
import { Link } from "react-router-dom";

import { equipments, equipmentsDetails } from "./Mock-data";



function EquipmentsGrid() {

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

            <Link to={"/create-equipment"}  style={{ textDecoration: 'none' }}>
                <Button variant="contained" endIcon={<AddCircleIcon />}>
                    Ajouter
                </Button>
            </Link>

        </Stack>
    )
}

export default EquipmentsGrid;