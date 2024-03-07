'use client';
import React, { useState } from 'react';
import { Radio, RadioGroup, useToast, Stack, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Image } from '@chakra-ui/react';
import axios from 'axios';

let endpoint = 'http://127.0.0.1:8000';

const EditModal = ({ isOpen, onClose, rowData }) => {
    const toast = useToast();
    const [editedData, setEditedData] = useState({
        namaLengkap: rowData.nama_lengkap,
        statusPenghuni: rowData.status_penghuni,
        nomorTelepon: rowData.nomor_telepon,
        statusPernikahan: rowData.status_pernikahan,
        fotoKtp: rowData.foto_ktp
    });
    const [fotoKtp, setFotoKtp] = useState(null); 
    const handleChange = (e) => {
        if (e.target) {
          const { name, value } = e.target;
          setEditedData({ ...editedData, [name]: value });
        }
      };

      const handleStatusPenghuniChange = (value) => {
        setEditedData({ ...editedData, statusPenghuni: value });
    };
    
    const handleStatusPernikahanChange = (value) => {
        setEditedData({ ...editedData, statusPernikahan: value });
    };
      const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file)
        setFotoKtp(file); 
        setEditedData({ ...editedData, fotoKtp: file });
    };
    
    const handleSubmit = async () => {
      
            const formData = new FormData();
            formData.append('namaLengkap', editedData.namaLengkap);
            formData.append('statusPenghuni', editedData.statusPenghuni);
            formData.append('nomorTelepon', editedData.nomorTelepon);
            formData.append('statusPernikahan', editedData.statusPernikahan);
            if (fotoKtp) {
                formData.append('fotoKtp', fotoKtp);
            }
            const options = {
                method: 'POST',
                url: `${endpoint}/api/penghuni/update/${rowData.id}`,
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
                <ModalHeader>Edit Data</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <Stack spacing={4}>
                    <FormControl className="mb-2">
                        <FormLabel>Nama Lengkap</FormLabel>
                        <Input name="namaLengkap" value={editedData.namaLengkap} onChange={handleChange} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Status Penghuni</FormLabel>
                        <RadioGroup name="statusPenghuni" defaultValue={editedData.statusPenghuni} onChange={handleStatusPenghuniChange}>
                            <Stack direction="row">
                                <Radio value="Kontrak">Kontrak</Radio>
                                <Radio value="Tetap">Tetap</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Nomor Telepon</FormLabel>
                        <Input name="nomorTelepon" value={editedData.nomorTelepon} onChange={handleChange} />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Status Pernikahan</FormLabel>
                        <RadioGroup name="statusPernikahan" defaultValue={editedData.statusPernikahan} onChange={handleStatusPernikahanChange}>
                            <Stack direction="row">
                                <Radio value="Sudah Menikah">Sudah Menikah</Radio>
                                <Radio value="Belum Menikah">Belum Menikah</Radio>
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                    <Flex justify="flex-start">
                        <Image width="80px"  src={`http://localhost:8000/uploads/penghuni/${rowData.foto_ktp}`} alt="Foto KTP" />
                    </Flex>
                    <FormControl>
                        <FormLabel>Upload Foto KTP Baru</FormLabel>
                        <div className="mt-1 flex items-center">
                        <input
                                id="fotoKtp"
                                type="file"
                                name="fotoKtp"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="sr-only"
                            />
                        </div>
                    </FormControl>
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
