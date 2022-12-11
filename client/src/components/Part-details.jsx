import React from "react";
import { useState, useEffect } from "react";
import { Divider, Button, Modal, Typography, Box, TextField } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Stack } from "@mui/system";
import useEth from "../contexts/EthContext/useEth";
import { PartOperationsList } from "./Operations-list";
import { useParams } from "react-router-dom";

import { operations } from "./Mock-data";



function PartSummary({part}) {
	return (
		<Stack direction="row" spacing={2}>

			<Stack>
				<Typography variant="h4">
					{part.category}
				</Typography>

				<Typography variant="body" color="text.secondary">
					Fabricant : {part.producerAddress}<br></br>
					Référence : {part.model}<br></br>
					Numéro de série : {part.serialNumber}
				
					{part.isListed && <Typography>For sale at: {part.listedPrice} MATIC</Typography>}
				</Typography>
			</Stack>

		</Stack>

	)
}

function PartOperations({partId}) {

	const ops = operations.filter(op => op.partId === '1');

	return (
		<Stack>
			<Typography variant="h4" gutterBottom>Opérations</Typography>
			<PartOperationsList operations={ops}/>
		</Stack>
	)
}

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function SellModal({ open, setOpen, getPart }) {
	let { partId } = useParams();
	const { state: { contract, accounts } } = useEth();
	const [listingPrice, setListingPrice] = useState('');
	const handleClose = () => setOpen(false);


	const handleListing = async() => {
		let approvedAddress;

		try {
			approvedAddress = await contract.methods.getApproved(partId).call({ from: accounts[0] });
		} catch (err) {
				alert(err);
		}
		if (contract._address !== approvedAddress) {
			try {
				await contract.methods.approve(contract._address, partId).call({ from: accounts[0] });
				await contract.methods.approve(contract._address, partId).send({ from: accounts[0] });
			} catch (err) {
				alert(err);
			}
		}

		try {
				await contract.methods.listPart(partId, listingPrice).call({ from: accounts[0] });
				await contract.methods.listPart(partId, listingPrice).send({ from: accounts[0] });
				setOpen(false);
				getPart();
		} catch (err) {
				alert(err);
		}
	};

	const handleListingPriceChange = (e) => {
		setListingPrice(e.target.value);
	};

	return(
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<Box sx={modalStyle}>
				<Typography id="modal-modal-title" variant="h6" component="h2" sx={{ marginBottom: 2 }}>
					Please enter your selling price:
				</Typography>
				<Stack spacing={2} direction="column" alignItems="center">
					<TextField 
						id="listingPrice"
						label="Selling Price"
						variant="outlined"
						value={listingPrice}
						onChange={handleListingPriceChange}
						InputProps={{
							startAdornment: <InputAdornment position="start">MATIC</InputAdornment>
						}}
						required
					/>
					<Button variant="contained" onClick={handleListing}>Confirm</Button>
				</Stack>
			</Box>
		</Modal>)
}

export default function PartDetails() {
	const { state: { contract, accounts } } = useEth();
	let { partId } = useParams();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const [part, setPart] = useState({});

	// Get one equipment and update the associated state
	const getPart = async () => {
			try {
					const tokenURI = await contract?.methods.tokenURI(partId).call({ from: accounts[0] });
					if (tokenURI) {
						const part = JSON.parse(tokenURI);
	
						const partListingInfo = await contract?.methods.parts(partId).call({ from: accounts[0] });
						part.isListed = partListingInfo.isListed;
						part.listedPrice = partListingInfo.listedPrice;
						part.id = partId;
	
						setPart(part);
					}
			} catch (err) {
					alert(err); 
			}
	};

	useEffect(() => {
		getPart();
	}, [accounts, contract]);

	const handleDelist = async() => {
		let approvedAddress;

		try {
			approvedAddress = await contract.methods.getApproved(partId).call({ from: accounts[0] });
		} catch (err) {
			alert(err);
		}
		if (contract._address === approvedAddress) {
			try {
				await contract.methods.approve('0x0000000000000000000000000000000000000000', partId).call({ from: accounts[0] });
				await contract.methods.approve('0x0000000000000000000000000000000000000000', partId).send({ from: accounts[0] });
			} catch (err) {
				alert(err);
			}
		}
		try {
			await contract.methods.delistPart(partId).call({ from: accounts[0] });
			await contract.methods.delistPart(partId).send({ from: accounts[0] });
			getPart();
		} catch (err) {
			alert(err);
		}
	};

	return (
		<Stack p={5} spacing={5}>

			<PartSummary part={part}/>

			{!part.isListed &&
				<Button variant="contained" endIcon={<ShoppingCartIcon />} sx={{width: '15%'}}
					onClick={handleOpen}
				>
					Put on sale
				</Button>
			}
			{part.isListed &&
				<Button variant="contained" endIcon={<ShoppingCartIcon />} sx={{width: '15%'}}
					onClick={handleDelist}
				>
					Delist part
				</Button>
			}

			<SellModal
				open={open}
				setOpen={setOpen}
				getPart={getPart}
			></SellModal>

			{/*
			<Divider />

			<PartOperations />
			*/}

		</Stack>
	)
}