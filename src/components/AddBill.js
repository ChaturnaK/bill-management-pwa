// src/components/AddBill.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
    collection,
    addDoc,
    Timestamp,
    serverTimestamp,
    onSnapshot,
} from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    Box,
    Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

const AddBill = () => {
    const [settlementDate, setSettlementDate] = useState(null); // start as null for placeholder
    const [billPeriodStart, setBillPeriodStart] = useState(null);
    const [billPeriodEnd, setBillPeriodEnd] = useState(null);
    const [amount, setAmount] = useState("");
    const [billName, setBillName] = useState("");
    const [billNames, setBillNames] = useState([]);

    useEffect(() => {
        const billsCol = collection(db, "bills");
        const unsubscribe = onSnapshot(billsCol, (snapshot) => {
            const namesSet = new Set();
            snapshot.forEach((doc) => {
                const data = doc.data();
                if (data.billName) {
                    namesSet.add(data.billName);
                }
            });
            setBillNames(Array.from(namesSet));
        });
        return () => unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const billPeriod =
            billPeriodStart && billPeriodEnd
                ? `${billPeriodStart.toLocaleString("default", { month: "short", year: "numeric" })} - ${billPeriodEnd.toLocaleString("default", { month: "short", year: "numeric" })}`
                : "";

        try {
            const billsCol = collection(db, "bills");
            await addDoc(billsCol, {
                // If settlementDate is null, you might want to handle it or set a default
                settlementDate: settlementDate
                    ? Timestamp.fromDate(settlementDate)
                    : null,
                billPeriod,
                amount: parseFloat(amount),
                billName,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            setSettlementDate(null);
            setBillPeriodStart(null);
            setBillPeriodEnd(null);
            setAmount("");
            setBillName("");
        } catch (error) {
            console.error("Error adding bill: ", error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <Typography variant="h5" align="center">
                Add New Bill
            </Typography>

            <FormControl fullWidth>
                <InputLabel shrink>Settlement Date</InputLabel>
                <DatePicker
                    selected={settlementDate}
                    onChange={(date) => setSettlementDate(date)}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Select Settlement Date"
                    customInput={<TextField fullWidth />}
                />
            </FormControl>

            <FormControl fullWidth>
                <InputLabel shrink>Bill Period Start (Month)</InputLabel>
                <DatePicker
                    selected={billPeriodStart}
                    onChange={(date) => setBillPeriodStart(date)}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    placeholderText="Select Start Month"
                    customInput={<TextField fullWidth />}
                />
            </FormControl>

            <FormControl fullWidth>
                <InputLabel shrink>Bill Period End (Month)</InputLabel>
                <DatePicker
                    selected={billPeriodEnd}
                    onChange={(date) => setBillPeriodEnd(date)}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                    showFullMonthYearPicker
                    placeholderText="Select End Month"
                    customInput={<TextField fullWidth />}
                />
            </FormControl>

            <TextField
                type="number"
                label="Amount (LKR)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                fullWidth
                inputProps={{ min: 0, step: 0.01 }}
                sx={{
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                }}
            />

            <Autocomplete
                freeSolo
                options={billNames}
                value={billName}
                onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                        setBillName(newValue);
                    } else {
                        setBillName(newValue);
                    }
                }}
                onInputChange={(event, newInputValue) =>
                    setBillName(newInputValue)
                }
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Bill Name"
                        helperText="Select from list or type new"
                        fullWidth
                    />
                )}
            />

            <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                }}
            >
                Add Bill
            </Button>
        </Box>
    );
};

export default AddBill;
