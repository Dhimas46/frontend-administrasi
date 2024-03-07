'use client';
import React, { useState, useEffect } from 'react';
import { Radio, RadioGroup, useToast, Stack, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Image, Select } from '@chakra-ui/react';
import axios from 'axios';

let endpoint = 'http://127.0.0.1:8000';

const EditModal = ({ isOpen, onClose, rowData }) => {
    const toast = useToast();
    const [editedData, setEditedData] = useState({
        alamatRumah: '',
        statusHunian: '',
        penghuni: '',
    });
    const [penghuniList, setPenghuniList] = useState([]); 

    useEffect(() => {
        if (rowData) {
            setEditedData({
                alamatRumah: rowData.alamat_rumah,
                statusHunian: rowData.status_hunian,
                penghuni: rowData.penghuni_id || '', 
            });
        }
        fetchPenghuniList(); 
    }, [rowData]);

    const fetchPenghuniList = async () => {
        try {
            const response = await axios.get(`${endpoint}/api/penghuni`);
            const penghuniData = response.data.data;
    
            const historyPenghuniResponse = await axios.get(`${endpoint}/api/history/penghuni`);
            const historyPenghuniData = historyPenghuniResponse.data.data;
    
            const filteredPenghuniList = penghuniData.filter(penghuni => {
                return !historyPenghuniData.some(historyPenghuni => historyPenghuni.penghuni_id === penghuni.id && historyPenghuni.status === 1);
            });
    
            setPenghuniList(filteredPenghuniList); 
        } catch (error) {
            console.error('Error fetching penghuni:', error);
        }
    };
    
    const handleStatusHunian = (value) => {
        setEditedData({ ...editedData, statusHunian: value });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('alamatRumah', editedData.alamatRumah);
        formData.append('statusHunian', editedData.statusHunian);
        formData.append('penghuni', editedData.penghuni);
        const options = {
            method: 'POST',
            url: `${endpoint}/api/history/penghuni/update/${rowData.id}`,
            data: formData,
        };
        
        axios(options)
            .then(response => {
                onClose();
                toast({
                    title: 'Data berhasil diperbarui.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
                window.location.reload();
            })
          
            .catch(error => {
                toast({
                    title: 'Gagal mengirim data.',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit Rumah</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Stack spacing={4}>
                        <FormControl>
                            <FormLabel>Alamat Rumah</FormLabel>
                            <Input name="alamatRumah" value={editedData.alamatRumah} onChange={handleChange} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Status Penghuni</FormLabel>
                            <RadioGroup name="statusHunian" defaultValue={editedData.statusHunian} onChange={handleStatusHunian}>
                                <Stack direction="row">
                                    <Radio value="Dihuni">Dihuni</Radio>
                                    <Radio value="Tidak dihuni">Tidak dihuni</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        {editedData.statusHunian === 'Dihuni' && (
                            <FormControl>
                                <FormLabel>Penghuni</FormLabel>
                                <Select
                                    placeholder="Pilih penghuni"
                                    value={editedData.penghuni}
                                    onChange={(e) => setEditedData({ ...editedData, penghuni: e.target.value })}
                                >
                                    {penghuniList.map(penghuni => (
                                        <option key={penghuni.id} value={penghuni.id}>{penghuni.nama_lengkap}</option>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {/* Add other form controls here */}
                    </Stack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Simpan Perubahan
                    </Button>
                    <Button onClick={onClose}>Batal</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditModal;
