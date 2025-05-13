// src/components/EditBill.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, updateDoc, Timestamp, serverTimestamp } from "firebase/firestore";
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

const EditBill = ({ bill, onClose }) => {
    const [settlementDate, setSettlementDate] = useState(new Date());
    const [billPeriodStart, setBillPeriodStart] = useState(null);
    const [billPeriodEnd, setBillPeriodEnd] = useState(null);
    const [amount, setAmount] = useState("");
    const [billName, setBillName] = useState("");
    const [billNames, setBillNames] = useState([]);

    useEffect(() => {
        if (bill) {
            setSettlementDate(
                bill.settlementDate ? bill.settlementDate.toDate() : new Date(),
            );
            if (bill.billPeriod) {
                const [startStr, endStr] = bill.billPeriod.split(" - ");
                const startDate = new Date(startStr);
                const endDate = new Date(endStr);
                setBillPeriodStart(isNaN(startDate) ? null : startDate);
                setBillPeriodEnd(isNaN(endDate) ? null : endDate);
            } else {
                setBillPeriodStart(null);
                setBillPeriodEnd(null);
            }
            setAmount(bill.amount || "");
            setBillName(bill.billName || "");
        }
    }, [bill]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const billPeriod =
            billPeriodStart && billPeriodEnd
                ? `${billPeriodStart.toLocaleString("default", { month: "short", year: "numeric" })} - ${billPeriodEnd.toLocaleString("default", { month: "short", year: "numeric" })}`
                : "";

        try {
            const billRef = doc(db, "bills", bill.id);
            await updateDoc(billRef, {
                settlementDate: Timestamp.fromDate(new Date(settlementDate)),
                billPeriod,
                amount: parseFloat(amount),
                billName,
                updatedAt: serverTimestamp(),
            });
            onClose();
        } catch (error) {
            console.error("Error updating bill:", error);
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleUpdate}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
            <Typography variant="h5" align="center">
                Edit Bill
            </Typography>

            <FormControl fullWidth>
                <InputLabel shrink>Settlement Date</InputLabel>
                <DatePicker
                    selected={settlementDate}
                    onChange={(date) => setSettlementDate(date)}
                    dateFormat="yyyy-MM-dd"
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
                Update Bill
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
                Cancel
            </Button>
        </Box>
    );
};

export default EditBill;
