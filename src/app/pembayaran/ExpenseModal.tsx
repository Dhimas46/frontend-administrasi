'use client';

import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';
let endpoint = 'http://127.0.0.1:8000';
function ExpenseModal() {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [expenseData, setExpenseData] = useState({
        jenisPengeluaran: '',
        jumlahPengeluaran: '',
        tanggalPengeluaran: ''
    });
    const [payments, setPayments] = useState([]);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(endpoint + '/api/pengeluaran');
            const responseData = await response.json();
            const totalExpenses = responseData.data.reduce((total, expense) => total + parseFloat(expense.jumlah_pengeluaran), 0);
    
            const paymentResponse = await fetch(endpoint + '/api/pembayaran');
            const paymentData = await paymentResponse.json();
            const totalPayments = paymentData.data.reduce((total, payment) => {
                if (payment.status_pembayaran === 'Lunas') {
                    return total + parseFloat(payment.jumlah_pembayaran);
                }
                return total;
            }, 0);
    
            const newBalance = totalPayments - totalExpenses;
            setBalance(newBalance);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseData({ ...expenseData, [name]: value });
    };

    const handleSubmit = async () => {
        const expenseAmount = parseFloat(expenseData.jumlahPengeluaran);
    
        if (expenseAmount > balance) {
            alert('Jumlah Pengeluaran tidak boleh lebih besar dari atau sama dengan Saldo.');
            return;
        }
    
        try {
            const response = await fetch(endpoint + '/api/pengeluaran/store', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expenseData),
            });
    
            if (!response.ok) {
                throw new Error('Failed to add expense.');
            }
    
            const responseData = await response.json();
            toast({
                title: 'Berhasil menambah data pengeluaran',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose();
            window.location.reload();
        } catch (error) {
            toast({
                title: 'Gagal menambah data pengeluaran',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    
        return (
        <div>
            <Button onClick={onOpen}>Tambah Pengeluaran</Button>
          
            <Modal isOpen={isOpen} onClose={onClose}>
                
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Tambah Pengeluaran</ModalHeader>
                    <ModalBody>
                    <p>Saldo: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(balance)}</p>

                        <FormControl>
                            <FormLabel>Jenis Pengeluaran</FormLabel>
                            <Input
                                placeholder="Perbaikan Jalan"
                                type="text"
                                name="jenisPengeluaran"
                                value={expenseData.jenisPengeluaran}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Jumlah Pengeluaran</FormLabel>
                            <Input
                                type="number"
                                name="jumlahPengeluaran"
                                value={expenseData.jumlahPengeluaran}
                                onChange={handleChange}
                            />
                        </FormControl>
                        <FormControl mt={4}>
                            <FormLabel>Tanggal Pengeluaran</FormLabel>
                            <Input
                                type="date"
                                name="tanggalPengeluaran"
                                value={expenseData.tanggalPengeluaran}
                                onChange={handleChange}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Simpan
                        </Button>
                        <Button variant="ghost" onClick={onClose}>
                            Batal
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}

export default ExpenseModal;
