import React from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EquipmentPreview from "./Equipment-preview";
import { Link } from "react-router-dom";

import { equipments, equipmentsDetails } from "./Mock-data";



function EquipmentsGrid() {

    return (
        <Grid container spacing={2} alignItems="center">

            {equipments.map((equipment) => {

                const id = equipment.id;
                const eqDetails = equipmentsDetails.find( eq => eq.equipmentId === id);
                const photo = eqDetails.photo;
                const description = eqDetails.description;

                return (
                    <Grid key={id} xs={12} sm={6} md={3} lg={2}>

                        <Link to={"/equipment/" + id}  style={{ textDecoration: 'none' }}>
                            <EquipmentPreview
                            name={equipment.category + " " + equipment.manufacturer}
                            description={description}
                            img={photo} />
                        </Link>

                    </Grid>
                )
            })}

            <Grid key={123} xs={12} sm={6} md={3} lg={2}>
                <Link to={"/create-equipment"}  style={{ textDecoration: 'none' }}>
                    <Button variant="contained" endIcon={<AddCircleIcon />}>
                        Ajouter
                    </Button>
                </Link>
            </Grid>

        </Grid>
    )
}

export default EquipmentsGrid;