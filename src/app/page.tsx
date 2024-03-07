









'use client';
import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Container, Card, CardBody, Button, Grid, GridItem, Select } from '@chakra-ui/react';
import Header from '../components/Header';
import { Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const HomePage: React.FC = () => {
  const [lineChartData, setLineChartData] = useState<any>(null);
  const [pieChartData, setPieChartData] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');


  const handleExport = (e) => {
    e.preventDefault();

    // Pastikan bulan telah dipilih sebelum mengirim permintaan
    // if (!selectedMonth) {
    //   alert('Pilih bulan terlebih dahulu!');
    //   return;
    // }

    fetch(`http://127.0.0.1:8000/api/summary/export?month=${selectedMonth}&year=${selectedYear}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Terjadi kesalahan saat mengunduh file.');
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'summary.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch(error => {
      console.error('Terjadi kesalahan:', error);
    });
  };
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };


  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/summary/chart')
      .then(response => response.json())
      .then(data => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const latestYear = Object.keys(data.data.totalPembayaran).pop(); 
        const latestMonth = Object.keys(data.data.totalPembayaran[latestYear]).pop();
  
        const labels = [];
        const pengeluaranValues = [];
        const pembayaranValues = [];
  
        for (let year in data.data.totalPembayaran) {
          for (let month = 1; month <= 12; month++) {
            if (year === latestYear && month > parseInt(latestMonth)) {
              break; 
            }
            const totalPengeluaran = data.data.totalPengeluaran[year]?.[month] || 0;
            const totalPembayaran = data.data.totalPembayaran[year]?.[month] || 0;
  
            pengeluaranValues.push(totalPengeluaran);
            pembayaranValues.push(totalPembayaran);
            labels.push(`${months[month - 1]} ${year}`);
          }
        }
  
        const lineChartData = {
          labels: labels,
          datasets: [
            {
              label: 'Pengeluaran',
              data: pengeluaranValues,
              borderColor: 'red',
              fill: false
            },
            {
              label: 'Pembayaran',
              data: pembayaranValues,
              borderColor: 'blue',
              fill: false
            }
          ]
        };

        setLineChartData(lineChartData);

        const totalPengeluaran = data.sumPengeluaran || 0;
        const totalPembayaran = data.sumPembayaran || 0;
        const saldo = data.saldo;

        const pieChartData = {
          labels: ['Pengeluaran', 'Pemasukan', 'Saldo'],
          datasets: [
            {
              data: [totalPengeluaran, totalPembayaran, saldo],
              backgroundColor: ['red', 'green', 'blue']
            }
          ]
        };

        setPieChartData(pieChartData);
      })
      .catch(error => console.error('Error fetching chart data:', error));
  }, []);
  
  return (
    <div>
      <Header />
      <Container maxW="container.xl" py={8}>
        <Box p={4}>
          <Heading as="h1" size="lg">Selamat Datang di Manajemen Iuran Perumahan Elite</Heading>
          <Text fontSize="lg" mt={4}>Sebagai RT, Anda memiliki tanggung jawab untuk mengelola administrasi pembayaran dan pengeluaran perumahan.</Text>
        </Box>
        <form onSubmit={handleExport}>
        <Grid templateColumns='repeat(5, 1fr)' gap={6}>
          <GridItem colSpan={{ base: 3, md: 2 }} h='10'>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Semua bulan</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </Select>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 2 }} h='10'>
          <Select value={selectedYear} onChange={handleYearChange} >
          <option value="">Semua tahun</option>
            <option value="2022">2022</option>
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </Select>
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }} h='10'>
          <Button type="submit" colorScheme="teal" ml={4}>Export</Button>
          </GridItem>
          </Grid>
        </form>
        <Grid marginTop="5" templateColumns='repeat(5, 1fr)' gap={6}>
          <GridItem colSpan={{ base: 3, md: 4 }} h='10'>
            {lineChartData && (
              <Card>
                <CardBody>
                  <Heading as="h2" size="md">Laporan Pengeluaran dan Pembayaran per Bulan</Heading>
                  <Line data={lineChartData} />
                </CardBody>
              </Card>
            )}
          </GridItem>
          <GridItem colSpan={{ base: 3, md: 1 }} h='10'>
            {pieChartData && (
              <Card>
                <CardBody>
                  <Heading as="h2" size="md">Laporan Pengeluaran, Pemasukan, dan Saldo</Heading>
                  <Pie data={pieChartData} aspectRatio={1} />
                </CardBody>
              </Card>
            )}
          </GridItem>
        </Grid>


      </Container>
    </div>
  );
  
  
};

export default HomePage;
