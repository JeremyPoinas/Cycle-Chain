import React from "react";
import { Button, Stack, TextField, Typography, Paper } from "@mui/material";

export default function AddOperation() {
    return (
        <Paper elevation={3} sx={{ maxWidth: 600 }}>
            <Stack p={5} spacing={2}>

                <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h5">Declare an operation</Typography>
                    <Button>Cancel</Button>
                </Stack>

                <TextField required id="manufacturer" label="Constructeur"/>
                <TextField required id="model" label="Modèle"/>
                <TextField required id="serialNumber" label="Numéro de série"/>
                <TextField required id="equipmentOwner" label="Propriétaire"/>
                <TextField
                    required
                    id="details"
                    label="Détails"
                    multiline
                    rows={4}
                />

                <Stack direction="row">
                    <Button variant="contained">Créer</Button>
                </Stack>

            </Stack>
        </Paper>

    )
}