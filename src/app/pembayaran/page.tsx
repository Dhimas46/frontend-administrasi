'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Box, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Flex, Text, Container, Card, Button, useToast } from '@chakra-ui/react';
import DataTable from 'react-data-table-component';
import Header from '../../components/Header';
import InitialFocus from "./InitialFocus";
import { ViewIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import EditModal from './EditModal';
import ExpenseModal from './ExpenseModal';
import PengeluaranModal from './PengeluaranModal';
import axios from 'axios'; 
import { set } from 'react-hook-form';

let endpoint = 'http://127.0.0.1:8000';

const Page = () => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [isPengeluaranModalOpen, setIsPengeluaranModalOpen] = useState(false);
    const toast = useToast();
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(endpoint +'/api/pembayaran');
            const responseData = await response.json();
            setData(responseData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const columns = [
        {
            name: 'Nama Lengkap',
            selector: row => row.penghuni.nama_lengkap,
            sortable: true,
        },
        {
            name: 'Tanggal Pembayaran',
            selector: row => row.tanggal_pembayaran,
            sortable: true,
        },
        {
            name: 'Jenis Iuran',
            selector: row => row.jenis_iuran,
            sortable: true,
        },
        {
            name: 'Jumlah Pembayaran',
            selector: row => (
                <Text>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(row.jumlah_pembayaran)}
                </Text>
            
            ),
            sortable: true,
        },
        {
            name: 'Status Pembayaran',
            cell: row => (
                <Text color={row.status_pembayaran === 'Lunas' ? 'green' : 'red'}>
                    {row.status_pembayaran}
                </Text>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <Flex justify="space-between">
                    <EditIcon color="blue.500" onClick={() => handleEdit(row)} cursor="pointer" boxSize={6} />
                    <DeleteIcon color="red.500" onClick={() => handleDelete(row)} cursor="pointer" boxSize={6} />
                </Flex>
            ),
        },
    ];
    
    const handleEdit = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true); 
    };

    const handleCloseModal = () => {
        setSelectedRow(null);
        setIsModalOpen(false);
    };

    const reloadData = async () => {
        fetchData(); 
    };

    const handleDelete = (row) => {
        setSelectedRow(row);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmation = async () => {
        try {
            const response = await axios.delete(`${endpoint}/api/pembayaran/delete/${selectedRow.id}`);
            if (response.status === 200) {
                toast({
                    title: 'Data berhasil dihapus',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                await fetchData();
            } else {
                throw new Error('Failed to delete data');
            }
        } catch (error) {
            toast({
                title: 'Gagal menghapus data',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedRow(null);
        }
    };
    

    const openExpenseModal = () => {
        setIsExpenseModalOpen(true);
    };

    const closeExpenseModal = () => {
        setIsExpenseModalOpen(false);
    };

    const openPengeluaranModal = () => {
        setIsPengeluaranModalOpen(true);
    }

    const closePengeluaranModal = () => {
        setIsPengeluaranModalOpen(false);
    }
    return (
        <div>
            <Header />  
            <Container maxW="container.xl" py={8}>
                <Card mb-2 p={6} boxShadow="md">
                    <Text>Kelola Pembayaran</Text>
                    <Flex justify="flex-end">
                    <Box marginRight="2">
                        <PengeluaranModal isOpen={isPengeluaranModalOpen} onClose={closePengeluaranModal} />
                    </Box>
                    <Box marginBottom="1">
                        <ExpenseModal isOpen={isExpenseModalOpen} onClose={closeExpenseModal} />
                    </Box>
                    <Box marginLeft="2">
                        <InitialFocus reloadData={reloadData} />
                    </Box>
                    </Flex>
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                    />
                </Card>
                {selectedRow && !isDeleteModalOpen && (
                    <EditModal isOpen={isModalOpen} onClose={handleCloseModal} rowData={selectedRow} />
                )}

                {isDeleteModalOpen && (
                    <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Konfirmasi Hapus</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                Apakah Anda yakin ingin menghapus data ini?
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="red" mr={3} onClick={handleDeleteConfirmation}>
                                    Hapus
                                </Button>
                                <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>Batal</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                )}

                
            </Container>
        </div>
    );
};

export default Page;
