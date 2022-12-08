import React from "react";
import { Card, CardMedia, Divider } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";
import { EquipmentOperationsList } from "./Operations-list";
import PartsTable from "./Parts-list";
import { useParams } from "react-router-dom";

import { parts, equipments, equipmentsDetails, operations, assemblies } from "./Mock-data";



function EquipmentSummary({equipmentId}) {

    const equipment = equipments.find(eq => eq.id === equipmentId);
    const equipmentDetails = equipmentsDetails.find( eq => eq.equipmentId === equipmentId);

    return (
        <Stack direction="row" justifyContent="space-between" spacing={2}>

            <Stack>
                <Typography variant="h4">
                    {equipment.category}
                </Typography>

                <Typography variant="body" color="text.secondary">
                    Fabricant : {equipment.manufacturer}<br></br>
                    Propriétaire : {equipmentDetails.owner}<br></br>
                    Modèle : {equipment.model}<br></br>
                    Numéro de série : {equipment.id}<br></br>
                    Détails : {equipmentDetails.description}
                </Typography>
            </Stack>


            <Card sx={{maxWidth: 300}}>
                <CardMedia
                    component="img"
                    height="200"
                    image= {equipmentDetails.photo}
                    alt="équipement"
                />
            </Card>

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

export default function EquipmentDetails() {

    let { equipmentId } = useParams();

    return (
        <Stack p={5} spacing={5}>

            <EquipmentSummary equipmentId={equipmentId}/>
            <Divider />
            <Parts equipmentId={equipmentId}/>
            <Divider />
            <EquipmentOperations equipmentId={equipmentId}/>
            
        </Stack>
    )
}