'use client';
import React, { useState, useEffect } from 'react';
import { Select, HStack, Radio, RadioGroup, useToast, Stack, Flex, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, Input, Image } from '@chakra-ui/react';
import axios from 'axios';

let endpoint = 'http://127.0.0.1:8000';

const EditModal = ({ isOpen, onClose, rowData }) => {
    const toast = useToast();
    const [editedData, setEditedData] = useState({
        jenisIuran: '',
        jenisPembayaran:'',
        tanggalPembayaran: '',
        statusPembayaran: '',
    });
    const [penghuniList, setPenghuniList] = useState([]);

    useEffect(() => {
        if (rowData) {
            setEditedData({
                jenisIuran: rowData.jenis_iuran,
                jenisPembayaran: rowData.jenis_pembayaran,
                tanggalPembayaran: rowData.tanggal_pembayaran || '', 
                statusPembayaran: rowData.status_pembayaran,
                penghuni:  rowData.penghuni_id 
            });
        }
        fetchPenghuniList();
    }, []);

    
  const fetchPenghuniList = async () => {
        try {
            const response = await axios.get(endpoint + '/api/penghuni');
            const penghuniData = response.data.data;

            setPenghuniList(penghuniData);
        } catch (error) {
            console.error('Error fetching penghuni:', error);
        }
    };

    const handleSubmit = async () => {
      
            const formData = new FormData();
            formData.append('jenisIuran', editedData.jenisIuran);
            formData.append('jenisPembayaran', editedData.jenisPembayaran);
            formData.append('tanggalPembayaran', editedData.tanggalPembayaran);
            formData.append('jumlahPembayaran', editedData.jumlahPembayaran);
            formData.append('statusPembayaran', editedData.statusPembayaran);
            formData.append('penghuni', editedData.penghuni);
            const options = {
                method: 'POST',
                url: `${endpoint}/api/pembayaran/update/${rowData.id}`,
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
    const calculateNewJumlahPembayaran = (jenisIuran, jenisPembayaran) => {
        if (jenisIuran === 'Satpam') {
            const hargaSatpamBulanan = 100000;
            let hargaSatpamTahunan = 0;
            if (jenisPembayaran === 'Tahunan') {
                hargaSatpamTahunan = hargaSatpamBulanan * 12;
            }
            return jenisPembayaran === 'Tahunan' ? hargaSatpamTahunan : hargaSatpamBulanan;
        } else if (jenisIuran === 'Kebersihan') {
            const HARGA_KEBERSIHAN = 15000;
            return jenisPembayaran === 'Tahunan' ? HARGA_KEBERSIHAN * 12 : HARGA_KEBERSIHAN;
        } else {
            return 0;
        }
    };
  
    useEffect(() => {
        const newJumlahPembayaran = calculateNewJumlahPembayaran(editedData.jenisIuran, editedData.jenisPembayaran);
        setEditedData(prevState => ({
            ...prevState,
            jumlahPembayaran: newJumlahPembayaran,
        }));
    }, [editedData.jenisIuran, editedData.jenisPembayaran]);
  
    const formattedJumlahPembayaran = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(editedData.jumlahPembayaran);
  

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                  <ModalHeader>Edit Pembayaran</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                      <Stack spacing={4}>
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

                          <FormControl>
                              <FormLabel>Jenis Iuran</FormLabel>
                              <RadioGroup value={editedData.jenisIuran} onChange={(value) => setEditedData({ ...editedData, jenisIuran: value })}>
                                  <HStack spacing={4}>
                                      <Radio value="Satpam">Satpam</Radio>
                                      <Radio value="Kebersihan">Kebersihan</Radio>
                                  </HStack>
                              </RadioGroup>
                          </FormControl>

                          {editedData.jenisIuran && (
                            <FormControl>
                                <FormLabel>Pembayaran</FormLabel>
                                <Select
                                    placeholder="Pilih jenis pembayaran"
                                    name="jenisPembayaran"
                                    value={editedData.jenisPembayaran}
                                    onChange={(e) => {
                                        const newValue = e.target.value;
                                        setEditedData({ ...editedData, jenisPembayaran: newValue });

                                        const newJumlahPembayaran = calculateNewJumlahPembayaran(editedData.jenisIuran, newValue);
                                        setEditedData(prevState => ({
                                            ...prevState,
                                            jumlahPembayaran: newJumlahPembayaran,
                                        }));
                                    }}
                                >
                                    <option value="Bulanan">Bulanan</option>
                                    <option value="Tahunan">Tahunan</option>
                                </Select>

                            </FormControl>
                        )}

                        {editedData.jenisIuran && editedData.jenisPembayaran && (
                            <FormControl>
                                <FormLabel>Jumlah Pembayaran</FormLabel>
                                <Input
                                    placeholder="Jumlah Pembayaran"
                                    name="jumlahPembayaran"
                                    value={formattedJumlahPembayaran}
                                    readOnly 
                                />
                            </FormControl>
                        )}

                          <FormControl>
                              <FormLabel>Tanggal Pembayaran</FormLabel>
                              <Input
                                  type="date"
                                  name="tanggalPembayaran"
                                  value={editedData.tanggalPembayaran}
                                  onChange={(value) => setEditedData({ ...editedData, tanggalPembayaran: value })}
                              />
                          </FormControl>

                          <FormControl>
                              <FormLabel>Status Pembayaran</FormLabel>
                              <Select
                                  name="statusPembayaran"
                                  value={editedData.statusPembayaran}
                                  onChange={(e) => setEditedData({ ...editedData, statusPembayaran: e.target.value })}
                              >
                                  <option value="">Pilih Status Pembayaran</option>
                                  <option value="Lunas">Lunas</option>
                                  <option value="Belum Lunas">Belum Lunas</option>
                              </Select>
                          </FormControl>
                      </Stack>
                  </ModalBody>

                  <ModalFooter>
                      <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                          Simpan
                      </Button>
                      <Button onClick={onClose}>Batal</Button>
                  </ModalFooter>
              </ModalContent>
        </Modal>
    );
};

export default EditModal;
