import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from "@mui/material/ListItemButton";
import Button from "@mui/material/Button";
import CreateIcon from '@mui/icons-material/Create';
import { Stack } from "@mui/system";
import { Chip, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import { parts, equipments } from "./Mock-data";


function EquipmentOperationItem({operation}) {

    const part = parts.find(p => p.id === operation.partId);
    console.log(part);
    
    return (
            <ListItem disablePadding>
                <ListItemButton>

                    <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>

                        <Chip label={operation.date} />
                        <Typography variant="body1">{operation.category+" "+part.category}</Typography>
                        <Typography variant="body2" color="text.secondary">{part.manufacturer +" ("+part.reference+")"}</Typography>

                    </Stack>

                </ListItemButton>
            </ListItem>
    )
}

function PartOperationItem({operation}) {

    const equipment = equipments.find(e => e.id === operation.equipmentId)
    
    return (
            <ListItem disablePadding>
                <ListItemButton>

                    <Stack direction="row" alignItems="center" spacing={1}>

                        <Chip label={operation.date} />
                        <Typography variant="body1">{operation.category+" dans "+equipment.category+" "+equipment.manufacturer}</Typography>
                        <Typography variant="body2" color="text.secondary">{" ("+equipment.model+")"}</Typography>

                    </Stack>

                </ListItemButton>
            </ListItem>
    )
}

export function EquipmentOperationsList({operations}) {
    console.log(operations);

    return (
            <Stack alignItems="flex-start" spacing={2}>

                <Paper>
                    <List dense>
                        {operations.map((operation, index) => (
                            <EquipmentOperationItem key={index} operation={operation} />
                        ))}
                    </List>
                </Paper>

                <Button variant="contained" endIcon={<CreateIcon />}>Ajouter</Button>

            </Stack>
    )
}


export function PartOperationsList({operations}) {

    return (
            <Stack alignItems="flex-start" spacing={2}>

                <Paper>
                    <List dense>
                        {operations.map((operation, index) => (
                            <PartOperationItem key={index} operation={operation} />
                        ))}
                    </List>
                </Paper>

                <Button variant="contained" endIcon={<CreateIcon />}>Ajouter</Button>

            </Stack>
    )
}