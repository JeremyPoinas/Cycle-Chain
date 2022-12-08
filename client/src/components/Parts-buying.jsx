import React from "react";
import { Typography, Stack, Card, CardContent, CardActions } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Button from "@mui/material/Button";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import useEth from "../contexts/EthContext/useEth";
import { parts } from "./Mock-data";


function PartCard({part}) {
	const { state: { contract, accounts } } = useEth();

    const handleBuying = async() => {
        try {
            alert(part.listedPrice);
            await contract.methods.marketBuyPart(part.id).call({ from: accounts[0], value: part.listedPrice });
            await contract.methods.marketBuyPart(part.id).send({ from: accounts[0], value: part.listedPrice});
        } catch (err) {
            alert(err);
        }
    };

    return (
        
        <Card>

            <CardContent>
                <Typography variant="h6">{part.category}</Typography>
                <Typography color="text.secondary">Référence : {part.reference}</Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">Numéro de série : {part.id}</Typography>
                <Typography variant="body">Délivrée par : Caterpillar</Typography>
                <Typography variant="h6">Price: {part.listedPrice} MATIC</Typography>
            </CardContent>

            <CardActions>
                <Button variant="contained" onClick={handleBuying} endIcon={<ShoppingCartIcon />}>Acheter</Button>
            </CardActions>

        </Card>
    )
}


function PartsGrid({parts}) {
    return (
        <Grid container spacing={2} alignItems="center">
            {parts.map(p => {
                return (
                    <Grid key={p.id} xs={12} sm={6} md={3} lg={2}>
                        <PartCard part={p} />
                    </Grid>
                )
            })}
        </Grid>
    )
}



export default function PartsBuying() {

    const partsToBuy = parts.filter(p => p.isListed === true);

    return (
        <Stack p={5}>
            <Typography variant="h4" sx={{ mb: 1.5 }}>Acheter une certification</Typography>
            { partsToBuy.length > 0 ? <PartsGrid parts={partsToBuy}/> : <span>Aucune pièce en vente</span> }
        </Stack>
    )
}