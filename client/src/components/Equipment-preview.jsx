import React from "react";
import Card from "@mui/material/Card";
import { CardContent, CardActionArea } from "@mui/material";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";


function EquipmentPreview({name, description, img}) {

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>

                <CardMedia
                component="img"
                alt="grue"
                height="140"
                image={img}
                />

                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {name}
                    </Typography>

                    <Typography variant="body" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>

            </CardActionArea>
        </Card>
    )
}

export default EquipmentPreview;