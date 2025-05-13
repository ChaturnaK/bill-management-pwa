// src/components/BillList.js
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    doc,
    deleteDoc,
} from "firebase/firestore";
import EditBill from "./EditBill";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Fade,
    TextField,
} from "@mui/material";

const BillList = () => {
    const [bills, setBills] = useState([]);
    const [editingBill, setEditingBill] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [billToDelete, setBillToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const billsCol = collection(db, "bills");
        const q = query(billsCol, orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const billsArray = [];
            snapshot.forEach((docSnap) => {
                billsArray.push({ id: docSnap.id, ...docSnap.data() });
            });
            setBills(billsArray);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            const billRef = doc(db, "bills", id);
            await deleteDoc(billRef);
            setDeleteDialogOpen(false);
            setBillToDelete(null);
        } catch (error) {
            console.error("Error deleting bill:", error);
        }
    };

    const openDeleteDialog = (bill) => {
        setBillToDelete(bill);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setBillToDelete(null);
    };

    // Filter bills by search term
    const filteredBills = bills.filter(
        (bill) =>
            bill.billName &&
            bill.billName.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <Box sx={{ mt: 4, width: "100%" }}>
            <Typography variant="h5" align="center" gutterBottom>
                Bills
            </Typography>

            {/* Search Bar */}
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    label="Search by Bill Name"
                    variant="outlined"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            {editingBill && (
                <EditBill
                    bill={editingBill}
                    onClose={() => setEditingBill(null)}
                />
            )}

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Period</TableCell>
                            <TableCell>Amount (LKR)</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredBills.map((bill) => (
                            <Fade key={bill.id} in={true} timeout={500}>
                                <TableRow>
                                    <TableCell>
                                        {bill.settlementDate
                                            ? bill.settlementDate
                                                  .toDate()
                                                  .toLocaleDateString()
                                            : ""}
                                    </TableCell>
                                    <TableCell>{bill.billPeriod}</TableCell>
                                    <TableCell>{bill.amount}</TableCell>
                                    <TableCell>{bill.billName}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            size="small"
                                            onClick={() => setEditingBill(bill)}
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                openDeleteDialog(bill)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </Fade>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the bill "
                        {billToDelete?.billName}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDelete(billToDelete.id)}
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BillList;
