import React from "react";
import { Divider } from "@mui/material";
import { Stack } from "@mui/system";
import Typography from "@mui/material/Typography";
import { PartOperationsList } from "./Operations-list";

import { parts, operations } from "./Mock-data";



function PartSummary({partId}) {

    const part = parts.find(p => p.id === partId);

    return (
        <Stack direction="row" spacing={2}>

            <Stack>
                <Typography variant="h4">
                    {part.category + " " + part.manufacturer}
                </Typography>

                <Typography variant="body" color="text.secondary">
                    Catégorie : {part.category}<br></br>
                    Fabricant : {part.manufacturer}<br></br>
                    Référence : {part.reference}<br></br>
                    Numéro de série : {part.id}
                </Typography>
            </Stack>

        </Stack>

    )
}

function PartOperations({partId}) {

    const ops = operations.filter(op => op.partId === partId);

    return (
        <Stack>
            <Typography variant="h4" gutterBottom>Opérations</Typography>
            <PartOperationsList operations={ops}/>
        </Stack>
    )
}

export default function PartDetails({partId}) {
    return (
        <Stack p={5} spacing={5}>

            <PartSummary partId={partId}/>

            <Divider />

            <PartOperations partId={partId}/>

        </Stack>
    )
}