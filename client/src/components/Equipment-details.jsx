import React from "react";
import { Card, CardMedia, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";
import OperationsList from "./Operations-list";
import PartsTable from "./Parts-list";

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

function Operations({equipmentId}) {

    const ops = operations.filter(op => op.equipmentId === equipmentId);

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Opérations</Typography>
            <OperationsList operations={ops}/>
        </Stack>
    )
}

function Parts({equipmentId}) {

    const partsIds = assemblies.find(assem => assem.equipmentId === equipmentId).parts;
    const partsArray = parts.filter( p => partsIds.includes(p.id) )

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Pièces certifiées</Typography>
            <PartsTable parts={partsArray} />
        </Stack>
    )
}

export default function EquipmentDetails({equipmentId}) {
    return (
        <Stack p={5} spacing={5}>

            <EquipmentSummary equipmentId={equipmentId}/>

            <Divider />

            <Stack direction="row" justifyContent="space-between">
                <Operations equipmentId={equipmentId}/>
                <Parts equipmentId={equipmentId}/>
            </Stack>

        </Stack>
    )
}