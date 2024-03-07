'use client';

import React, { useState, useEffect } from 'react';
import { Select, HStack , Radio ,RadioGroup, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, FormControl, FormLabel, Input, Stack, useDisclosure, useToast, Image, Box } from "@chakra-ui/react";
import axios from 'axios';


let endpoint = 'http://127.0.0.1:8000';

const InitialFocus = ({ reloadData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [formData, setFormData] = useState({
      penghuni: '',
      jenisIuran: '',
      jenisPembayaran: '',
      jumlahPembayaran: '',
      tanggalPembayaran: '',
      statusPembayaran: '',
  });

  const [penghuniList, setPenghuniList] = useState([]);

  useEffect(() => {
      fetchPenghuniList();
  }, []);

  const handleChange = (e) => {
      const { name, value } = e.target;
      let cleanValue = value;
      cleanValue = cleanValue.replace(/[^\d,.]/g, '');
      cleanValue = cleanValue.replace(/,(?![\d]{3}(?:$|,))/g, '');
      cleanValue = cleanValue.replace(/\u00A0/g, '');

      setFormData(prevState => ({
          ...prevState,
          [name]: name === 'jumlahPembayaran' ? cleanValue : value,
      }));
  };

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
    try {
        const formDataToSend = new FormData();
        formDataToSend.append('penghuni', formData.penghuni);
        formDataToSend.append('jenisIuran', formData.jenisIuran);
        formDataToSend.append('jenisPembayaran', formData.jenisPembayaran);
        formDataToSend.append('jumlahPembayaran', formData.jumlahPembayaran);
        formDataToSend.append('tanggalPembayaran', formData.tanggalPembayaran); 
        formDataToSend.append('statusPembayaran', formData.statusPembayaran); 

        const response = await axios.post(endpoint+'/api/pembayaran/store', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (response.status !== 200) {
            throw new Error('Failed to update data');
        }

        onClose();
        toast({
            title: 'Data berhasil diperbarui.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        window.location.reload();
    } catch (error) {
        toast({
            title: 'Gagal mengirim data.',
            description: error.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
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
      const newJumlahPembayaran = calculateNewJumlahPembayaran(formData.jenisIuran, formData.jenisPembayaran);
      setFormData(prevState => ({
          ...prevState,
          jumlahPembayaran: newJumlahPembayaran,
      }));
  }, [formData.jenisIuran, formData.jenisPembayaran]);

  const formattedJumlahPembayaran = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
  }).format(formData.jumlahPembayaran);

  return (
      <>
          <Button onClick={onOpen}>Tambah Pembayaran</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                  <ModalHeader>Tambah Pembayaran</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody pb={6}>
                      <Stack spacing={4}>
                          <FormControl>
                              <FormLabel>Penghuni</FormLabel>
                              <Select
                                  placeholder="Pilih penghuni"
                                  value={formData.penghuni}
                                  onChange={(e) => setFormData({ ...formData, penghuni: e.target.value })}
                              >
                                  {penghuniList.map(penghuni => (
                                      <option key={penghuni.id} value={penghuni.id}>{penghuni.nama_lengkap}</option>
                                  ))}
                              </Select>
                          </FormControl>

                          <FormControl>
                              <FormLabel>Jenis Iuran</FormLabel>
                              <RadioGroup value={formData.jenisIuran} onChange={(value) => setFormData({ ...formData, jenisIuran: value })}>
                                  <HStack spacing={4}>
                                      <Radio value="Satpam">Satpam</Radio>
                                      <Radio value="Kebersihan">Kebersihan</Radio>
                                  </HStack>
                              </RadioGroup>
                          </FormControl>

                          {formData.jenisIuran && (
                              <FormControl>
                                  <FormLabel>Pembayaran</FormLabel>
                                  <Select
                                      placeholder="Pilih jenis pembayaran"
                                      name="jenisPembayaran"
                                      value={formData.jenisPembayaran}
                                      onChange={(e) => {
                                          const newValue = e.target.value;
                                          setFormData({ ...formData, jenisPembayaran: newValue });
                                          // Mengatur nilai jumlahPembayaran sesuai dengan jenis iuran dan jenis pembayaran yang dipilih
                                          const newJumlahPembayaran = calculateNewJumlahPembayaran(formData.jenisIuran, newValue);
                                          setFormData(prevState => ({
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

                          {formData.jenisIuran && formData.jenisPembayaran && (
                              <FormControl>
                                  <FormLabel>Jumlah Pembayaran</FormLabel>
                                  <Input
                                      placeholder="Jumlah Pembayaran"
                                      name="jumlahPembayaran"
                                      value={formattedJumlahPembayaran}
                                      readOnly // Tambahkan atribut readOnly agar input tidak bisa diedit secara langsung
                                  />
                              </FormControl>
                          )}

                          <FormControl>
                              <FormLabel>Tanggal Pembayaran</FormLabel>
                              <Input
                                  type="date"
                                  name="tanggalPembayaran"
                                  value={formData.tanggalPembayaran}
                                  onChange={handleChange}
                              />
                          </FormControl>

                          <FormControl>
                              <FormLabel>Status Pembayaran</FormLabel>
                              <Select
                                  name="statusPembayaran"
                                  value={formData.statusPembayaran}
                                  onChange={(e) => setFormData({ ...formData, statusPembayaran: e.target.value })}
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
      </>
  );
};

export default InitialFocus;
