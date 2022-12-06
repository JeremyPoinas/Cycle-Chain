import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ConstructionIcon from '@mui/icons-material/Construction';
import ListItemButton from "@mui/material/ListItemButton";


function OperationItem({title, details}) {
    return (
        <ListItem disablePadding>
            <ListItemButton>

                <ListItemIcon>
                    <ConstructionIcon />
                </ListItemIcon>

                <ListItemText primary={title} secondary={details}/>

            </ListItemButton>
        </ListItem>
    )
}

export default function OperationsList({operations}) {

    return (
        <List dense>
            {operations.map((operation, index) => (
                <OperationItem key={index} title={operation.description} details={operation.date} />
            ))}
        </List>
    )

}
