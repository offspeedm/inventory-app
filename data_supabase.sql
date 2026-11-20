--
-- PostgreSQL database dump
--

\restrict mbVzziBdrr3CACKUH2fV2fBecmmyPG8LvEmlmKjhXbX2IGIwT5IXHdKuwLEqMVe

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('9aaebd14-b8b4-4047-8014-870f758b081d', 'ec886d12d411049beac7440d14324b21a521d9e136aa863228be7cd719f892c1', '2026-08-17 02:57:14.629791+00', '20260817025714_init', NULL, NULL, '2026-08-17 02:57:14.467076+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('19f3a5e4-c39d-483b-929c-6ec494330615', 'cb0205dbc41f563e1d8315debdf0ffe9ab1a3c9ad90788958437fe2aed4a59b9', '2026-08-17 18:33:46.457937+00', '20260817183346_tambah_no_telp_perusahaan', NULL, NULL, '2026-08-17 18:33:46.347688+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('d2238137-6c8d-492e-bbb7-f20412204476', '48fb4339fb138f01ccf96b0ed653712c0db451278db9827f5a4b4c5c6a2c1994', '2026-08-17 19:04:04.198048+00', '20260817190403_tambah_inisial_perusahaan', NULL, NULL, '2026-08-17 19:04:04.079247+00', 1);
INSERT INTO public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) VALUES ('de5588a4-1d74-4e3a-81f5-c41990952b3f', 'c967fa74a7973ce72295a9a6b92be07fc193156958e6168ad8bc2e977535d0c3', '2026-08-18 03:03:09.628801+00', '20260818030309_tambah_notelp_divisi_user', NULL, NULL, '2026-08-18 03:03:09.456075+00', 1);


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.companies (id, nama, alamat, created_at, no_telp, inisial) VALUES (3, 'PT. Glorindo Oksana Logistics', 'Grand Kota Bintang
Ruko Amsterdam Blok H 9
Jl. Kota Bintang Boulevard, Jakasampurna,
Kota Bekasi, Jawa Barat, 17145
', '2026-08-17 03:06:09.241', '02130286355', 'GOL');
INSERT INTO public.companies (id, nama, alamat, created_at, no_telp, inisial) VALUES (4, 'PT. Swift Kargonize', 'Puri Sentra Niaga, Blok A20-21, Jatiwaringin, Kalimalang. Jakarta Timur 13260, Indonesia', '2026-08-17 03:06:09.454', NULL, 'SWK');
INSERT INTO public.companies (id, nama, alamat, created_at, no_telp, inisial) VALUES (6, 'PT. CNL Logistik Indonesia', 'Grand Kota Bintang
Ruko Amsterdam Blok H 9
Jl. Kota Bintang Boulevard, Jakasampurna,
Kota Bekasi, Jawa Barat, 17145', '2026-08-17 04:13:27.018', '02130286366', 'CNL');
INSERT INTO public.companies (id, nama, alamat, created_at, no_telp, inisial) VALUES (1, 'PT. Speedmark Logistik Indonesia', 'Puri Sentra Niaga, Blok A20-21, Jatiwaringin, Kalimalang. Jakarta Timur 13260, Indonesia', '2026-08-17 03:06:07.756', '+62 21 8610805', 'SLI');
INSERT INTO public.companies (id, nama, alamat, created_at, no_telp, inisial) VALUES (2, 'PT. Sarana Allport Indonesia', 'Puri Sentra Niaga, Blok A20-21, Jatiwaringin, Kalimalang. Jakarta Timur 13260, Indonesia', '2026-08-17 03:06:08.74', NULL, 'SAI');


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (1, 'SMT JKT', 'Jakarta', 1, '2026-08-17 03:06:07.885');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (2, 'SMT BDG', 'Bandung', 1, '2026-08-17 03:06:07.99');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (3, 'SMT DPS', 'Denpasar', 1, '2026-08-17 03:06:08.089');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (4, 'SMT MES', 'Medan', 1, '2026-08-17 03:06:08.241');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (5, 'SMT SUB', 'Surabaya', 1, '2026-08-17 03:06:08.34');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (6, 'SMT SRG', 'Semarang', 1, '2026-08-17 03:06:08.439');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (8, 'BASECAMP', 'Tanjung Priok', 1, '2026-08-17 03:06:08.639');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (9, 'SAI JKT', 'Jakarta', 2, '2026-08-17 03:06:08.841');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (10, 'SAI MES', 'Medan', 2, '2026-08-17 03:06:08.941');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (11, 'SAI SUB', 'Surabaya', 2, '2026-08-17 03:06:09.041');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (12, 'SAI SRG', 'Semarang', 2, '2026-08-17 03:06:09.14');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (13, 'GOL BKS', 'Bekasi', 3, '2026-08-17 03:06:09.349');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (14, 'Swift JKT', 'Jakarta', 4, '2026-08-17 03:06:09.552');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (15, 'Swift DPS', 'Denpasar', 4, '2026-08-17 03:06:09.652');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (24, 'CNL SRG', 'Semarang', 6, '2026-08-17 15:23:05.782');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (25, 'CNL SUB', 'Surabaya', 6, '2026-08-17 15:23:17.658');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (26, 'CNL MES', 'Medan', 6, '2026-08-17 15:23:34.012');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (23, 'CNL BKS', 'Bekasi', 6, '2026-08-17 15:22:50.586');
INSERT INTO public.branches (id, nama, kota, company_id, created_at) VALUES (7, 'SMT CGK', 'Cengkareng', 1, '2026-08-17 03:06:08.54');


--
-- Data for Name: device_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (1, 'Laptop', '2026-08-17 03:06:10.449', 'NTB');
INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (2, 'Desktop', '2026-08-17 03:06:10.548', 'CPU');
INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (3, 'Monitor', '2026-08-17 03:06:10.648', 'MNR');
INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (4, 'Printer', '2026-08-17 03:06:10.747', 'PRN');
INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (5, 'Router', '2026-08-17 03:06:10.847', 'RTR');
INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (6, 'CCTV', '2026-08-17 03:06:10.947', 'CTV');
INSERT INTO public.device_types (id, nama, created_at, kode) VALUES (7, 'Perangkat Lainnya', '2026-08-17 03:06:11.047', 'PLN');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (53, 'Dita Ayu Larasati', 'dita@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:26.183', 'Operational', '+62 857-0696-6230', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (55, 'Nanang Ade Surya', 'nanang@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:26.506', 'Operational', '+62 812-3135-2458', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (56, 'Novi Damayanthi', 'novi@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:26.641', 'Operational', '+62 812-4949-4694', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (57, 'Nur Halimah', 'nur@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:26.765', 'Operational', '+62 812-4984-4845', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (58, 'Sriningsih', 'ningsih@speeedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:26.937', 'Finance', '+62 897-3966-156', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (59, 'Tina Cristina Ratminingtyas', 'tina@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:27.076', 'Operational', '+62 812-3179-2060', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (60, 'Trianie Maya Rosita', 'maya@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:27.246', 'Operational', '+62 881-3534-685', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (61, 'Muhammad Zainur Roziqin', 'ozi@speedmark.co.id', NULL, 'staff', 1, 5, '2026-08-24 07:57:27.434', 'Operational', '+62 858-5148-5847', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (66, 'Cynthia Efraini Watung', 'cynthia@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:34.389', 'Operational', '+62 838-9396-0055', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (67, 'Diah Ika Mustari', 'diah@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:34.611', 'Operational', '+62 855-9183-3150', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (68, 'Enty Nurani', 'enty @speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:34.85', 'Billing', '+62 878-6676-9286', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (69, 'Fitria Utami', 'fitri@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:35.046', 'Operational', '+62 856-9327-3547', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (70, 'Hayati Nupus', 'puput@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:35.187', 'Operational', '+62 838-9616-0211', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (71, 'Inggit Kameliawati', 'inggit@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:35.35', 'Operational', '+62 895-0572-2061', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (72, 'Rahmat Alfiyansyah', 'rahmat@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:35.517', 'Operational', '+62 878-7564-7535', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (73, 'Rina Savita Hardiani', 'rsavita@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:35.754', 'Operational', '+62 859-4564-9000', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (74, 'Riszal Nurudin Isnaini', 'riszal@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:36.011', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (75, 'Robby Kusuma Wijaya', 'robby@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:36.196', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (77, 'Atikah Fairus Siti Badriah', 'atika@speedmark.co.id', NULL, 'staff', 1, 7, '2026-08-24 07:57:36.587', 'Operational', '+62 895-6170-64668', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (78, 'Yussy Rusydah', 'yussy@speedmark.co.id', NULL, 'staff', 1, 3, '2026-08-24 07:57:36.832', 'Operational', '+62 813-3838-896', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (79, 'Ni Komang Wely Idayarti', 'wely@speedmark.co.id', NULL, 'staff', 1, 3, '2026-08-24 07:57:37.082', 'Operational', '+62 817-4763-051', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (80, 'Muhamad Hanafi', 'hanafi@speedmark.co.id', NULL, 'staff', 1, 3, '2026-08-24 07:57:37.23', 'Operational', '+62 812-2559-8658', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (81, 'Akhsony Maulana', 'sony@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:02.841', 'Operational', '+62 815-1586-6356', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (82, 'Alivia Hajar Chotijatul Rahma', 'alivia@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:03.026', 'Operational', '+62 812-3565-2537', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (83, 'Aprilia Indriyastuti', 'aprilia.indriyastuti@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:03.219', 'Operational', '+62 858-7932-3558', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (84, 'Arnica Pinastikha Renata Wijaya', 'arnica@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:03.371', 'Operational', '+62 821-3988-3845', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (86, 'Aryutia Dwi Santoso', 'arya@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:03.658', 'Operational', '+62 812-1036-0360', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (87, 'Audy Nur Afifah', 'audy@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:03.842', 'Finance', '+62 895-1500-1426', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (88, 'Dinda Meyliana Putri', 'dinda_meyliana@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:04.307', 'Admin - HR', '+62 882-0080-65470', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (89, 'Dinda Permatasari', 'dinda_permatasari@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:04.807', 'Operational', '+62 823-3734-4464', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (90, 'Enggal Suko Pangastiti', 'enggal@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:05.032', 'Admin - HR', '+62 821-3629-7879', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (91, 'Febri Indri Setiani', 'febri@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:05.368', 'Operational', '+62 855-4066-3736', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (93, 'Kamila Soima', 'Kamila@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:05.805', 'Operational', '+62 858-7659-6370', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (94, 'Muhammad Rizky Freantara', 'rizky_freantara@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:05.928', 'Operational', '+62 857-4986-1571', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (95, 'Nanda Andy Wicaksono', 'andy.wicaksono@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:06.104', 'Operational', '+62 857-9133-1181', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (96, 'Nurhayani', 'nurhayani@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:06.254', 'Finance', '+62 896-7626-1333', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (97, 'Olivia Devi Yuniastanti', 'olivia@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:06.431', 'Operational', '+62 895-3811-94373', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (98, 'Ramadani Putri Kusnadi', 'ramadani@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:06.597', 'Admin - HR', '+62 812-9112-7484', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (101, 'Romahtul Muharromah', 'rohma@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:07.015', 'Admin - HR', '+62 812-3396-9393', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (102, 'Sukmiati', 'yati@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:07.183', 'Operational', '+62 882-1100-5003', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (103, 'Widya Handayani', 'widya@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:07.362', 'Operational', '+62 878-8700-2862', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (104, 'Yulinda Sutantiani', 'linda@cnlogistics.co.id', NULL, 'staff', 6, 25, '2026-08-24 07:58:07.519', 'Operational', '+62 821-3281-0098', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (105, 'Aditya Novitasari', 'aditya@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:07.663', 'Operational', '+62 857-1331-4140', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (108, 'Arini Lussytasari', 'arini@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:08.163', 'Operational', '+62 895-6061-86083', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (109, 'Febri Kurniawati', 'nia.febri@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:08.312', 'Operational', '+62 881-0250-21988', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (62, 'Abdul Rohman', NULL, NULL, 'staff', 1, 7, '2026-08-24 07:57:33.683', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (63, 'Ade Sofyan', NULL, NULL, 'staff', 1, 7, '2026-08-24 07:57:33.853', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (106, 'Andintya Faradilla', NULL, NULL, 'staff', 6, 24, '2026-08-24 07:58:07.819', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (107, 'Andreas Adam Alfareza', NULL, NULL, 'staff', 6, 24, '2026-08-24 07:58:08.01', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (85, 'Arsy Yusa Ramadhan', NULL, NULL, 'staff', 6, 25, '2026-08-24 07:58:03.523', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (64, 'Asti Ayu Lestari', NULL, NULL, 'staff', 1, 7, '2026-08-24 07:57:34.036', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (65, 'Cahaya Galuh Saputro', NULL, NULL, 'staff', 1, 7, '2026-08-24 07:57:34.219', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (76, 'Suryati Ningsih', NULL, NULL, 'staff', 1, 7, '2026-08-24 07:57:36.399', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (99, 'Regzi Samara Putra', NULL, NULL, 'staff', 6, 25, '2026-08-24 07:58:06.712', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (100, 'Rika Gemina', 'rika@cnlogistics.co.id', NULL, 'staff', 3, 13, '2026-08-24 07:58:06.853', 'Operational', '+62 812-8007-946', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (110, 'Fitri Nur Rahmawati', 'fitri@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:08.448', 'Operational', '+62 882-3298-1058', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (111, 'Irfan Dwi Saputra', 'irfan@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:08.693', 'Operational', '+62 852-1883-2205', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (113, 'Nanda Rischi Pratama', 'nanda.rischi@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:09.119', 'Operational', '+62 822-5625-8004', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (115, 'Putri Dani Sinta Pratama', 'putri@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:09.57', 'Operational', '+62 895-3660-08716', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (116, 'Setyawati Charalli', 'setyawati@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:09.711', 'Operational', '+62 822-4621-7496', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (117, 'Varicha Rahma Ariyanti', 'varicha@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-08-24 07:58:09.937', 'Operational', '+62 859-2625-1269', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (118, 'Vivi Suzana Br Tarigan', 'vivi@speedmark.co.id', NULL, 'staff', 6, 26, '2026-08-24 07:58:10.079', 'Operational', '+62 812-1443-5659', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (119, 'Lili Amelia', 'lily@cnlogistics.co.id', NULL, 'staff', 6, 26, '2026-08-24 07:58:10.312', 'Operational', '+62 852-7502-0363', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (125, 'Lidya Rodearni Sidauruk', 'lidya@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:11.583', 'Operational', '+62 815-1716-5128', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (127, 'Rakes Octa Dwi Syukur', 'rakes@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:11.958', 'Operational', '+62 895-3644-07442', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (128, 'Rangga Pranata', 'rangga@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:12.138', 'Operational', '+62 877-8093-7726', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (129, 'Robiyanto Dwi Purnomo', 'robi@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:12.349', 'Billing', '+62 853-5302-4808', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (133, 'Winer Pratama', 'tama@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:13.051', 'Operational', '+62 821-4961-0392', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (134, 'Nugroho Mei Sulistiono', 'tio@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-08-24 07:58:13.216', 'Sales', '+62 889-0597-6647', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (135, 'Ade Haqiqi Fatmawatie', 'haqiqi@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:45.057', 'Finance', '+62 813-2690-5964', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (136, 'Adhwa Rona Syakila', 'rona@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:45.202', 'Finance', '+62 895-0420-9755', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (137, 'Aditya Perdana Putra', 'aditya@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:45.352', 'Operational', '+62 812-8917-0311', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (139, 'Ajeng Woelandari', 'ajeng@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:45.635', 'Operational', '+62 817-9999-413', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (141, 'Ananda Suci Anggraeni', 'ananda@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:45.934', 'Finance', '+62 878-8571-3030', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (142, 'Andhika Satria Prima', 'andhika@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:46.127', 'Operational', '+62 851-5644-7313', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (146, 'Anton Wahyudi', 'anton@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:47.072', 'Operational', '+62 856-9162-1148', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (147, 'Apud Saepudin', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:47.298', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (149, 'Aristya Kurniati', 'aristya@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:47.771', 'Finance', '+62 818-0616-6511', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (150, 'Audri Ayuningtyas', 'audri.ayuningtiyas@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:48.054', 'Billing', '+62 898-8382-516', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (151, 'Bella Adela Islami', 'bella.adela@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:48.336', 'Billing', '+62 813-8163-4001', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (152, 'Chairul Imam', 'chairul.im@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:48.542', 'IT-CI-BD', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (153, 'Citra Putri Mawadi', 'citra@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:48.716', 'Operational', '+62 896-3645-3810', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (154, 'Denny Setiawan', 'denny@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:48.872', 'Operational', '+62 878-8950-8291', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (156, 'Dika Ramadhona', 'dika@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:49.28', 'Operational', '+62 813-1433-3340', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (157, 'Erica Ramadhananny', 'erica@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:49.476', 'Admin - HR', '+62 812-8117-3155', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (158, 'Evi Wahyuni', 'evi@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:49.654', 'Operational', '+62 812-1221-7974', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (160, 'Fajar Wahid', 'fajar_w@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:50.019', 'Finance', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (162, 'Galih Kartika Kuswandari', 'galih@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:50.335', 'Operational', '+62 856-1553-359', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (164, 'Hanny Novida Pangestuti', 'hanny@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:50.753', 'Admin - HR', '+62 813-8733-0679', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (166, 'Hotma Ida Septiyani', 'hotmaida@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:51.092', 'Operational', '+62 813-1756-1653', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (168, 'Indria Permata Sari', 'indri@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:51.422', 'Admin - HR', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (169, 'Izwar Barnoza', 'izwar@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:51.615', 'IT-CI-BD', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (170, 'Jovanca Anjaranti Astitie', 'jovanca@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:51.837', 'Operational', '+62 855-1719-775', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (171, 'Kristina Kusumawati', 'kristin@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:52.04', 'Admin - HR', '+62 812-1040-6572', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (145, 'Annidha', 'Annidha@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:46.76', 'Finance', '+62 895-3432-65285', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (138, 'Adrian Dwitomo', 'adrian@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:45.501', 'Management', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (122, 'Endang Sri Susanti', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:10.912', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (143, 'Andini Oktavia', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:46.352', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (120, 'Andrea Debora Narulita', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:10.458', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (144, 'Angga Saudi', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:46.525', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (121, 'Deri Fadila', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:10.626', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (155, 'Dhaffa Fadillah Wepta', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:49.045', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (159, 'Fairuz Meidiana Irbah H', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:49.845', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (163, 'Gina Orba Pratiwi', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:50.507', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (123, 'Hilman Akbar  Al Hayat', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:11.157', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (167, 'Iman Widodo', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:51.248', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (124, 'Kiki Wahyu Lestari', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:11.376', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (132, 'Tinesya Talenta Simanjuntak', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:12.834', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (131, 'Syafira Putri Rahmah Ningrum', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:12.671', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (130, 'Shifa Bintang Hermawan Putri', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:12.523', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (126, 'Purwanti', NULL, NULL, 'staff', 6, 23, '2026-08-24 07:58:11.756', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (114, 'Oktafiani', NULL, NULL, 'staff', 6, 24, '2026-08-24 07:58:09.386', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (172, 'Lulu Atalina Masruroh', 'lulu.atalina@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:52.282', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (173, 'Luthfi Kamilah Zahrah', 'luthfi@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:52.522', 'Operational', '+62 813-8305-3833', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (174, 'M. Syamsul Arif', 'm.arief@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:52.772', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (175, 'Maghfira Rifda', 'rara@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:52.929', 'Operational', '+62 821-1899-3743', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (177, 'Mohamad Yusup', 'yusup@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:53.31', 'Operational', '+62 857-1910-9781', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (179, 'Muhamad Rizal', 'm.rizal@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:53.641', 'Operational', '+62 856-9355-9652', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (180, 'Muhammad Rizki Maulana', 'm.maulana@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:53.801', 'IT-CI-BD', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (181, 'Mustika Wulandari', 'wulan@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:54.026', 'Operational', '+62 878-8072-1220', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (184, 'Nining Widiastuti', 'tuty@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:54.721', 'Finance', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (187, 'Nurrahma Desti D', 'desti@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:55.373', 'Operational', '+62 813-8692-3269', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (190, 'Peni Rahma Sari', 'penirahmasari@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:56.214', 'Billing', '+62 858-1356-2932', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (191, 'Reza Seno Saputro', 'seno@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:56.408', 'Operational', '+62 896-5280-2189', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (192, 'Rizki Syukur Perdana', 'rizki@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:56.578', 'Operational', '+62 813-8191-4947', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (193, 'Rizky Sagita Ardana', 'sagita@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:56.73', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (194, 'Saleh Afif', 'afif@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:56.915', 'Operational', '+62 857-1801-1116', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (196, 'Sigit Widakdo', 'sigit@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:57.304', 'Operational', '+62 817-7668-9892', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (197, 'Siti Khalimah', 'imah@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:57.538', 'Billing', '+62 856-9312-5753', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (198, 'Siti Khasanah', 'siti@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:57.767', 'Billing', '+62 878-9334-0405', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (199, 'Slamet Imam Santoso', 'imam_s@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:57.977', 'Finance', '+62 856-9144-6683', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (200, 'Sutiya Haryati', 'sutiya@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:58.305', 'Finance', '+62 882-1999-6575', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (201, 'Tiara Anissa', 'tiara@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:58.542', 'IT-CI-BD', '+62 813-9526-9563', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (203, 'Titi Suwarti', 'titi@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:59.211', 'Operational', '+62 899-6859-293', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (204, 'Vira Oktafiyani Asmara', 'vira.oktafiyani@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:59.382', 'Billing', '+62 857-1107-8198', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (206, 'Windi Pravitasari', 'windi_p@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:59.774', 'Finance', '+62 857-8129-6961', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (207, 'Yanti Esterlina Lumban Gaol', 'yanti@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:59.938', 'Operational', '+62 877-8105-9123', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (208, 'Yonathan Pradana', 'yonathan.pradana@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 08:00:00.301', 'IT-CI-BD', '+62 858-8245-5240', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (209, 'Yulian Arlan', 'arlan@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 08:00:00.512', 'Operational', '+62 817-805-122', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (210, 'Zafira Aulia Ridwani', 'aulia@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 08:00:00.667', 'Operational', '+62 821-2205-6692', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (212, 'Wahyuningsih', 'wahyuningsih@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 08:00:00.996', 'Billing', '+62 818-0721-1849', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (214, 'Avit Nugroho', 'avit@glorindo.co.id', NULL, 'staff', 3, 13, '2026-08-24 08:00:17.41', 'Billing', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (215, 'Jody YN', 'jody@glorindo.co.id', NULL, 'staff', 3, 13, '2026-08-24 08:00:17.543', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (216, 'Rizki Putri Imani', 'putri@glorindo.co.id', NULL, 'staff', 3, 13, '2026-08-24 08:00:17.686', 'Finance', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (219, 'Fathaniah', 'nia@idallportcargoservices.com', NULL, 'staff', 2, 12, '2026-08-24 08:03:05.871', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (220, 'Hendra Hariyanto', 'hendra@id.allportcargoservices.com', NULL, 'staff', 2, 12, '2026-08-24 08:03:06.04', 'Sales', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (221, 'Ika Widiyawati', 'ika@id.allportcargoservices.com', NULL, 'staff', 2, 12, '2026-08-24 08:03:06.232', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (222, 'Rigel Hendrianjani', 'rigel@id.allportcargoservices.com', NULL, 'staff', 2, 12, '2026-08-24 08:03:06.36', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (223, 'Risa Septiana', 'risa@id.allportcargosenrices.com', NULL, 'staff', 2, 12, '2026-08-24 08:03:06.484', 'Operational', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (224, 'Siti Masruroh', 'siti@idallportcargoservices.com', NULL, 'staff', 2, 12, '2026-08-24 08:03:06.642', 'Finance', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (226, 'Alifah Nur Bintang Laili', 'alifah@speedmark.co.id', NULL, 'staff', 1, 6, '2026-08-24 08:03:27.229', 'Operational', '+62 882-1543-4378', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (227, 'Aulia Lurisa Anandani', 'lurisa.aulia@speedmark.co.id', NULL, 'staff', 1, 6, '2026-08-24 08:03:27.39', 'Operational', '+62 895-4229-07375', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (228, 'Fridaylia Tamara Kusumaningtyas', 'fridaylia@speedmark.co.id', NULL, 'staff', 1, 6, '2026-08-24 08:03:27.574', 'Operational', '+62 813-2763-0795', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (230, 'Nila Fadhilah Nafisah', 'nila@speedmark.co.id', NULL, 'staff', 1, 6, '2026-08-24 08:03:28.029', 'Operational', '+62 823-2967-4127', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (232, 'Wildan Iyyas Farakhan', 'wildan@speedmark.co.id', NULL, 'staff', 1, 6, '2026-08-24 08:03:28.513', 'Operational', '+62 882-2141-1241', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (217, 'Yuli Yanti', 'yuli@glorindo.co.id', NULL, 'staff', 3, 13, '2026-08-24 08:00:17.823', 'Admin - HR', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (213, 'Rini Waluyono', 'rini@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 08:00:01.2', 'Management', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (225, 'Abdurrahman Azzam Aiman', NULL, NULL, 'staff', 1, 6, '2026-08-24 08:03:27.031', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (218, 'Arida Nur Ismayati', NULL, NULL, 'staff', 2, 12, '2026-08-24 08:03:05.728', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (229, 'Ginanjar Kawilujengan', NULL, NULL, 'staff', 1, 6, '2026-08-24 08:03:27.804', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (234, 'Harleyandri Anggara Putra', NULL, NULL, 'staff', 1, 2, '2026-08-24 08:03:28.933', 'Sales', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (211, 'Zahrah Maydina Salma', NULL, NULL, 'staff', 1, 1, '2026-08-24 08:00:00.839', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (202, 'Tika Aldilafisma', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:58.96', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (195, 'Sicilia Febriyanti', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:57.077', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (231, 'Septiana Sri Lestari', NULL, NULL, 'staff', 1, 6, '2026-08-24 08:03:28.281', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (189, 'Parimin', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:55.979', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (188, 'Nyimas Sri Sita Sari', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:55.593', 'Sales', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (182, 'Muthiah Mumpuni Handayani', NULL, NULL, 'staff', 1, 1, '2026-08-24 07:59:54.296', 'Billing', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (112, 'Meiyana Putri Anandalia', 'meiyana@cnlogistics.co.id', NULL, 'staff', 3, 13, '2026-08-24 07:58:08.904', 'Finance', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (233, 'Fridayuni Lestari Siregar', 'frida@speedmark.co.id', NULL, 'staff', 1, 4, '2026-08-24 08:03:28.783', 'Admin - HR', '+62 812-4015-5918', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (235, 'Marisa Ria Angela', NULL, NULL, 'staff', 1, 2, '2026-08-24 08:03:29.155', 'Admin - HR', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (92, 'Intan Sonia Mayanti', NULL, NULL, 'staff', 6, 25, '2026-08-24 07:58:05.624', 'Operational', NULL, 'Non-Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (186, 'Nurita Timianti', 'nurita@speedmark.co.id', NULL, 'staff', 1, 1, '2026-08-24 07:59:55.19', 'Sales', NULL, 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (236, 'Yulyus Fernandus', 'yulyus@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-09-04 03:09:56.803', NULL, '+62 812-9724-7375', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (237, 'Rifky Tisna Yudanta', 'tisna@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-09-04 06:37:22.853', NULL, '+62 813-9095-5004', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (238, 'Alzha Bella Putri Mudrofin', 'alzha@cnlogistics.co.id', NULL, 'staff', 6, 24, '2026-09-04 06:41:33.277', NULL, '+62 819-1952-1049', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (239, 'Saskia Alfathia', 'saskia@cnlogistics.co.id', NULL, 'staff', 6, 23, '2026-09-08 06:58:59.69', NULL, '62 855-8033-915', 'Aktif');
INSERT INTO public.users (id, nama, email, jabatan, role, company_id, branch_id, created_at, divisi, no_telp, status) VALUES (240, 'Siti Roudoh', NULL, NULL, 'staff', 1, 7, '2026-09-08 07:21:39.128', NULL, NULL, 'Non-Aktif');


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (157, 'ExAngelaDPS', 1, NULL, NULL, NULL, 'Aktif', 1, 3, 80, '2026-09-04 08:03:27.719', 'Laptop Ex Angela', NULL, NULL, 'NTB/SLI-0926-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (161, 'ExDionSAISUB', 1, NULL, '2021-08-10', NULL, 'Aktif', 1, 5, 53, '2026-09-04 08:03:32.642', 'Laptop Ex Dion SAI SRG, pernah di pakai Indrawati', 'Lenovo', 'Ideapad 3 14IML05', 'NTB/SLI-0821-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (162, 'ExRinaCGK', 1, NULL, '2022-02-09', NULL, 'Rusak', 1, 5, NULL, '2026-09-04 08:03:34.574', 'Laptop Ex Bu Rina CGK di kirim ke Surabaya, rusak tidak bisa di pasang SSD, kemungkinan port SSD nya konslet', 'Asus', 'X415JAB_A416JA', 'NTB/SLI-0222-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (163, 'ExCynthiaCGK', 1, NULL, '2022-07-12', NULL, 'Tidak dipakai', 1, 4, NULL, '2026-09-04 08:03:36.757', 'Laptop Ex Cynthia CGK, di pakai Ruby', 'Lenovo', 'Ideapad 3 14IGL05', 'NTB/SLI-0722-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (164, 'ExNoviSUB', 1, NULL, '2022-12-09', NULL, 'Aktif', 1, 5, 57, '2026-09-04 08:03:38.092', 'Laptop Ex Novi SUB, di pakai Nur Halimah', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1222-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (165, 'ExRizkyJKT', 1, NULL, '2023-02-13', NULL, 'Aktif', 1, 5, 61, '2026-09-04 08:03:39.288', 'Laptop Ex Rizky JKT, di pakai Ozi Surabaya', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-0223-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (166, 'ExArifSAI', 1, NULL, '2023-06-03', NULL, 'Aktif', 2, 9, 228, '2026-09-04 08:03:40.427', 'Laptop Ex Pak Arif JKT, di kirim ke Semarang', 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/SAI-0623-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (167, 'ExYusufJKT', 1, NULL, '2023-07-27', NULL, 'Aktif', 1, 1, 177, '2026-09-04 08:03:41.527', 'Laptop Pembelian sebelum peremajaan, dan tetap di pakai oleh Yusup', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-0723-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (168, 'ExSitaJKT', 1, NULL, '2019-09-06', NULL, 'Aktif', 1, 6, 227, '2026-09-04 08:03:42.6', 'Laptop Ex Rudi, kemudian di pakai Sita dan di kirim ke Semarang', 'Asus', 'Vivobook 14 A412FA', 'NTB/SLI-0919-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (169, 'NB050', 1, 'PF48LGQM', '2023-11-16', NULL, 'Aktif', 1, 5, 58, '2026-09-04 08:03:44.417', 'Laptop Ex Alm Indrawati, dipakai april, lalu di pakai Bu Sriningsih', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (170, 'NB033', 1, 'PF4A2SBR', '2023-11-16', NULL, 'Aktif', 1, 7, 67, '2026-09-04 08:03:46.038', 'Laptop Ex Roudoh, dipakai Diah', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (171, 'NB001', 1, 'PF48M6WF', '2023-11-16', NULL, 'Aktif', 1, 1, 146, '2026-09-04 08:03:47.356', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (172, 'NB002', 1, 'PF48Y8L3', '2023-11-16', NULL, 'Aktif', 1, 1, 191, '2026-09-04 08:03:48.886', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-004');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (173, 'NB003', 1, 'PF48MX83', '2023-11-16', NULL, 'Aktif', 6, 24, 111, '2026-09-04 08:03:50.676', 'Irfan pindah ke CNL', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/CNL-1123-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (175, 'NB005', 1, 'PF482PPX', '2023-11-16', NULL, 'Aktif', 1, 1, 209, '2026-09-04 08:03:53.509', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-006');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (176, 'NB006', 1, 'PF48XQE4', '2023-11-16', NULL, 'Aktif', 1, 1, 166, '2026-09-04 08:03:55.245', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-007');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (177, 'NB007', 1, 'PF4963LB', '2023-11-16', NULL, 'Aktif', 1, 1, 194, '2026-09-04 08:03:57.159', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-008');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (178, 'NB008', 1, 'PF488BKP', '2023-11-16', NULL, 'Aktif', 1, 1, 193, '2026-09-04 08:03:59.458', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-009');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (179, 'NB009', 1, 'PF4KCLD7', '2023-11-16', NULL, 'Aktif', 1, 1, 180, '2026-09-04 08:04:00.691', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-010');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (180, 'NB010', 1, 'PF488TVX', '2023-11-16', NULL, 'Aktif', 1, 1, 173, '2026-09-04 08:04:02.821', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-011');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (181, 'NB011', 1, 'PF488TB1', '2023-11-16', NULL, 'Aktif', 1, 7, 71, '2026-09-04 08:04:04.632', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-012');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (183, 'NB013', 1, 'PF488TDS', '2023-11-16', NULL, 'Aktif', 1, 1, 203, '2026-09-04 08:04:07.953', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-014');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (184, 'NB014', 1, 'PF4A2LJF', '2023-11-16', NULL, 'Aktif', 1, 1, 154, '2026-09-04 08:04:09.633', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-015');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (185, 'NB015', 1, 'PF48Y7C2', '2023-11-16', NULL, 'Aktif', 2, 12, 224, '2026-09-04 08:04:11.911', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SAI-1123-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (186, 'NB016', 1, 'PF4AF4SZ', '2023-11-16', NULL, 'Aktif', 2, 12, 221, '2026-09-04 08:04:12.953', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SAI-1123-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (187, 'NB017', 1, 'PF48M4NB', '2023-11-16', NULL, 'Tidak dipakai', 1, 7, NULL, '2026-09-04 08:04:14.002', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-016');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (188, 'NB018', 1, 'PF488MG1', '2023-11-16', NULL, 'Aktif', 1, 1, 208, '2026-09-04 08:04:15.349', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-017');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (189, 'NB019', 1, 'PF4AFWS5', '2023-11-16', NULL, 'Aktif', 1, 1, 198, '2026-09-04 08:04:17.009', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-018');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (190, 'NB020', 1, 'PF46ZTW6', '2023-11-16', NULL, 'Aktif', 1, 1, 142, '2026-09-04 08:04:18.497', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-019');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (191, 'NB021', 1, 'PF4AFWVY', '2023-11-16', NULL, 'Aktif', 1, 1, 150, '2026-09-04 08:04:19.833', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-020');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (192, 'NB022', 1, 'PF48MPFD', '2023-11-16', NULL, 'Aktif', 1, 1, 190, '2026-09-04 08:04:20.785', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-021');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (193, 'NB023', 1, 'PF48YA0H', '2023-11-16', NULL, 'Aktif', 1, 1, 197, '2026-09-04 08:04:21.962', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-022');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (194, 'NB024', 1, 'PF4A2NYX', '2023-11-16', NULL, 'Aktif', 1, 1, 151, '2026-09-04 08:04:23.093', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-023');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (195, 'NB025', 1, 'PF47KAD8', '2023-11-16', NULL, 'Aktif', 1, 1, 204, '2026-09-04 08:04:24.322', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-024');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (196, 'NB026', 1, 'PF48MPF5', '2023-11-16', NULL, 'Aktif', 1, 1, 210, '2026-09-04 08:04:26.351', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-025');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (197, 'NB027', 1, 'PF482MG6', '2023-11-16', NULL, 'Aktif', 1, 1, 158, '2026-09-04 08:04:27.98', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-026');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (198, 'NB028', 1, 'PF49634F', '2023-11-16', NULL, 'Aktif', 1, 3, 78, '2026-09-04 08:04:29.204', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-027');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (199, 'NB029', 1, 'PF48M6TM', '2023-11-16', NULL, 'Aktif', 1, 1, 196, '2026-09-04 08:04:30.644', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-028');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (200, 'NB030', 1, 'PF4ABWPK', '2023-11-16', NULL, 'Aktif', 1, 1, 153, '2026-09-04 08:04:32.191', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-029');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (201, 'NB031', 1, 'PF482PRY', '2023-11-16', NULL, 'Aktif', 1, 1, 172, '2026-09-04 08:04:33.441', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-030');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (202, 'NB032', 1, 'PF4ABWQK', '2023-11-16', NULL, 'Aktif', 1, 1, 175, '2026-09-04 08:04:34.705', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-031');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (203, 'NB034', 1, 'PF488TD2', '2023-11-16', NULL, 'Aktif', 2, 9, 219, '2026-09-04 08:04:35.952', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SAI-1123-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (204, 'NB035', 1, 'PF48NSMW', '2023-11-16', NULL, 'Aktif', 1, 1, 212, '2026-09-04 08:04:37.145', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-032');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (205, 'NB036', 1, 'PF4A2QEF', '2023-11-16', NULL, 'Aktif', 1, 1, 162, '2026-09-04 08:04:38.108', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-033');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (206, 'NB037', 1, 'PF48N1RA', '2023-11-16', NULL, 'Aktif', 1, 1, 207, '2026-09-04 08:04:39.135', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-034');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (207, 'NB038', 1, 'PF48Y85R', '2023-11-16', NULL, 'Aktif', 1, 7, 68, '2026-09-04 08:04:40.293', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-035');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (159, 'ExEntyCGK', 1, NULL, '2021-07-01', NULL, 'Rusak', 1, 6, NULL, '2026-09-04 08:03:29.821', 'Laptop Ex Enty CGK di kirim ke SRG untuk di pakai dian', 'Acer', NULL, 'NTB/SLI-0721-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (160, 'ExIkaSAISRG', 1, NULL, '2021-07-10', NULL, 'Rusak', 1, 6, NULL, '2026-09-04 08:03:31.032', 'Laptop Ex Ika sai di pakai Azam SMT', 'Acer', NULL, 'NTB/SLI-0721-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (174, 'NB004', 1, 'PF48LMA1', '2023-11-16', NULL, 'Aktif', 1, 7, 77, '2026-09-04 08:03:52.161', 'Laptop Pembelian untuk Amelia, kemudian di pakai inggit', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-005');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (158, 'ExBagasSRG', 1, NULL, '2021-01-09', NULL, 'Tidak dipakai', 1, 6, NULL, '2026-09-04 08:03:28.84', 'Laptop Ex Bagas', 'Acer', 'SP5?', 'NTB/SLI-0121-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (208, 'NB039', 1, 'PF48MPGH', '2023-11-16', NULL, 'Tidak dipakai', 1, 7, NULL, '2026-09-04 08:04:42.879', 'saat ini di pagang anak magang', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-036');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (210, 'NB041', 1, 'PF46ZX4B', '2023-11-16', NULL, 'Aktif', 1, 1, 139, '2026-09-04 08:04:44.873', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-038');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (212, 'NB043', 1, 'PF4AFWRD', '2023-11-16', NULL, 'Aktif', 1, 1, 164, '2026-09-04 08:04:48.504', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-040');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (214, 'NB045', 1, 'PF4KCG65', '2023-11-16', NULL, 'Aktif', 2, 9, 174, '2026-09-04 08:04:52.057', NULL, 'Lenovo', 'V14 G3 IAP', 'NTB/SAI-1123-004');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (216, 'NB047', 1, 'PF48M6T6', '2023-11-16', NULL, 'Aktif', 1, 5, 56, '2026-09-04 08:04:54.824', NULL, 'Lenovo', 'V14 G3 IAP', 'NTB/SLI-1123-043');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (218, 'NB049', 1, 'PF48YGC7', '2023-11-16', NULL, 'Aktif', 1, 6, 230, '2026-09-04 08:04:57.775', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-045');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (209, 'NB040', 1, 'PF4AF52C', '2023-11-16', NULL, 'Aktif', 1, 1, 156, '2026-09-04 08:04:43.702', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-037');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (211, 'NB042', 1, 'PF48MV12', '2023-11-16', NULL, 'Aktif', 1, 1, 171, '2026-09-04 08:04:46.378', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-039');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (213, 'NB044', 1, 'PF4KABV3', '2023-11-16', NULL, 'Aktif', 1, 1, 192, '2026-09-04 08:04:49.66', NULL, 'Lenovo', 'V14 G3 IAP', 'NTB/SLI-1123-041');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (215, 'NB046', 1, 'PF4KB88M', '2023-11-16', NULL, 'Aktif', 1, 1, 169, '2026-09-04 08:04:53.96', NULL, 'Lenovo', 'V14 G3 IAP', 'NTB/SLI-1123-042');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (217, 'NB048', 1, 'PF4ABWS7', '2023-11-16', NULL, 'Aktif', 1, 5, 55, '2026-09-04 08:04:56.196', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-044');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (219, 'NB051', 1, 'PF48M6VP', '2023-11-16', NULL, 'Aktif', 1, 7, 72, '2026-09-04 08:04:59.243', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-046');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (220, 'NB052', 1, 'PF4KC513', '2023-11-16', NULL, 'Aktif', 1, 7, 73, '2026-09-04 08:05:00.23', NULL, 'Lenovo', 'V14 G3 IAP', 'NTB/SLI-1123-047');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (221, 'NB053', 1, 'PF48MTX0', '2023-11-16', NULL, 'Aktif', 1, 7, 66, '2026-09-04 08:05:01.273', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-048');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (222, 'NB054', 1, 'PF3SSSSN', '2024-01-23', NULL, 'Aktif', 1, 5, 59, '2026-09-04 08:05:02.453', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/SLI-0124-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (223, 'NB055', 1, 'PF4S7ZE2', '2024-04-27', NULL, 'Aktif', 1, 1, 181, '2026-09-04 08:05:03.567', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/SLI-0424-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (224, 'NB056', 1, 'PF4SF1LA', '2024-06-10', NULL, 'Aktif', 1, 1, 187, '2026-09-04 08:05:04.855', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/SLI-0624-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (225, 'NB057', 1, 'PF4SGK91', '2024-07-10', NULL, 'Aktif', 1, 7, 70, '2026-09-04 08:05:06.294', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/SLI-0724-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (226, 'NB058', 1, 'PF4QXFVP', '2024-08-21', NULL, 'Aktif', 1, 1, 160, '2026-09-04 08:05:07.377', NULL, 'Lenovo', 'V14 G4 IRU', 'NTB/SLI-0824-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (227, 'NB059', 1, 'PF55CA41', '2025-03-05', NULL, 'Aktif', 6, 23, 86, '2026-09-04 08:05:09.075', NULL, 'Lenovo', 'Ideapad 3 14IAH8', 'NTB/CNL-0325-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (229, 'NB061', 1, 'PF5KFXK0', '2025-12-22', NULL, 'Aktif', 1, 1, 186, '2026-09-04 08:05:11.114', NULL, 'Lenovo', 'V14 G4 IRU', 'NTB/SLI-1225-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (230, 'NB062', 1, 'PF5SFW9H', '2026-03-31', NULL, 'Aktif', 1, 1, 199, '2026-09-04 08:05:11.953', 'Laptop pembelian untuk persiapan WFH Acoounting', 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/SLI-0326-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (231, 'NB063', 1, 'PF5RY5B8', '2026-04-01', NULL, 'Aktif', 1, 1, 137, '2026-09-04 08:05:13.122', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/SLI-0426-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (232, 'NB064', 1, 'PF63WNBH', '2026-05-12', NULL, 'Aktif', 1, 1, 201, '2026-09-04 08:05:14.141', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/SLI-0526-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (233, 'NB065', 1, 'PF63ELQR', '2026-05-12', NULL, 'Aktif', 1, 6, 226, '2026-09-04 08:05:15.6', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/SLI-0526-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (234, 'NB066', 1, 'PF63WATW', '2026-05-13', NULL, 'Aktif', 1, 7, 66, '2026-09-04 08:05:16.793', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/SLI-0526-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (235, 'NB067', 1, 'PF612HYF', '2026-06-03', NULL, 'Aktif', 1, 1, 206, '2026-09-04 08:05:17.968', NULL, 'Lenovo', 'V15 G5 IRL', 'NTB/SLI-0626-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (236, 'NB068', 1, 'PF6129B2', '2026-06-03', NULL, 'Aktif', 1, 1, 184, '2026-09-04 08:05:18.89', NULL, 'Lenovo', 'V15 G5 IRL', 'NTB/SLI-0626-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (237, 'NB069', 1, 'PF60060W', '2026-08-19', NULL, 'Aktif', 1, 7, 69, '2026-09-04 08:05:19.853', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/SLI-0826-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (238, 'NBSAI-001', 1, 'W1NXCV02M912026', '2026-05-20', NULL, 'Aktif', 2, 9, 220, '2026-09-04 08:05:21.412', NULL, 'Asus', 'Expertbook P1403CVA-S63850WS', 'NTB/SAI-0526-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (239, 'NBCNL-001', 1, 'PF4N3255', '2024-01-29', NULL, 'Aktif', 6, 23, 236, '2026-09-04 08:05:22.793', 'Laptop Pembelian untuk Purwanti', 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (240, 'NBCNL-002', 1, 'PF4N651P', '2024-01-29', NULL, 'Aktif', 6, 23, 125, '2026-09-04 08:05:23.783', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (241, 'NBCNL-003', 1, 'PF4NT27B', '2024-01-29', NULL, 'Aktif', 6, 25, 89, '2026-09-04 08:05:25.154', 'Laptop Pembelian Intan', 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (242, 'NBCNL-004', 1, 'PF4N322F', '2024-01-29', NULL, 'Aktif', 6, 25, 82, '2026-09-04 08:05:26.612', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-004');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (243, 'NBCNL-005', 1, 'PF4N5VVC', '2024-01-29', NULL, 'Aktif', 6, 25, 104, '2026-09-04 08:05:27.95', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-005');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (244, 'NBCNL-006', 1, 'PF4N27K7', '2024-01-29', NULL, 'Aktif', 6, 25, 81, '2026-09-04 08:05:29.04', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-006');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (245, 'NBCNL-007', 1, 'PF4N3260', '2024-01-29', NULL, 'Aktif', 6, 24, 115, '2026-09-04 08:05:30.357', 'Laptop di beli untuk putri lalu akan di tinggal di semanrag', 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-007');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (246, 'NBCNL-008', 1, 'PF4N36EY', '2024-01-29', NULL, 'Aktif', 6, 24, 110, '2026-09-04 08:05:31.839', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-008');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (247, 'NBCNL-009', 1, 'PF4MYFKE', '2024-01-29', NULL, 'Aktif', 6, 26, 118, '2026-09-04 08:05:33.352', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-009');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (248, 'NBCNL-010', 1, 'PF4N2358', '2024-01-29', NULL, 'Aktif', 6, 26, 119, '2026-09-04 08:05:34.587', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0124-010');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (249, 'NBCNL-011', 1, 'PF4YLXC9', '2024-08-27', NULL, 'Aktif', 6, 25, 88, '2026-09-04 08:05:35.748', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0824-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (250, 'NBCNL-012', 1, 'PF50GVH3', '2024-10-09', NULL, 'Aktif', 6, 25, 97, '2026-09-04 08:05:37.108', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-1024-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (251, 'NBCNL-013', 1, 'PF4YZ03M', '2024-10-17', NULL, 'Aktif', 6, 23, 129, '2026-09-04 08:05:38.542', NULL, 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-1024-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (252, 'NBCNL-014', 1, 'PF50WVFZ', '2025-01-13', NULL, 'Aktif', 6, 25, 115, '2026-09-04 08:05:39.418', 'Laptop yang di beli saat putri pindah ke surabaya', 'Lenovo', 'Ideapad 3 14IAU7', 'NTB/CNL-0125-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (253, 'NBCNL-015', 1, 'PF58108D', '2025-03-07', NULL, 'Aktif', 6, 23, 103, '2026-09-04 08:05:40.784', NULL, 'Lenovo', 'V15 G3 IAP', 'NTB/CNL-0325-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (254, 'NBCNL-016', 1, 'PF5MJAJN', '2025-11-17', NULL, 'Aktif', 6, 23, 112, '2026-09-04 08:05:42.003', NULL, 'Lenovo', 'V15 G5 IRL', 'NTB/CNL-1125-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (255, 'NBCNL-017', 1, 'PF5XT10R', '2025-02-04', NULL, 'Aktif', 6, 24, 109, '2026-09-04 08:05:43.315', 'Laptop Pembelian Oktafiani', 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0225-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (256, 'NBCNL-018', 1, 'PF5Y074T', '2025-02-04', NULL, 'Aktif', 6, 24, 113, '2026-09-04 08:05:44.241', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0225-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (257, 'NBCNL-019', 1, 'PF5SZGCW', '2025-02-09', NULL, 'Aktif', 6, 23, 128, '2026-09-04 08:05:45.713', 'Laptop pembelian debora', 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0225-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (258, 'NBCNL-020', 1, 'PF5ZAGF6', '2026-02-07', NULL, 'Aktif', 6, 25, 83, '2026-09-04 08:05:47.335', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0226-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (259, 'NBCNL-021', 1, 'PF5TAGQ9', '2026-03-03', NULL, 'Aktif', 6, 25, 95, '2026-09-04 08:05:48.303', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0326-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (260, 'NBCNL-022', 1, 'PF5YA8EJ', '2026-03-03', NULL, 'Aktif', 6, 25, NULL, '2026-09-04 08:05:49.322', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0326-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (261, 'NBCNL-023', 1, 'PF5Z9DWK', '2026-03-03', NULL, 'Aktif', 6, 25, 94, '2026-09-04 08:05:50.263', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0326-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (262, 'NBCNL-024', 1, 'PF5Z6AB3', '2026-02-12', NULL, 'Aktif', 6, 25, 93, '2026-09-04 08:05:51.283', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0226-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (263, 'NBCNL-025', 1, 'PF5XZV25', '2026-03-30', NULL, 'Aktif', 6, 23, 91, '2026-09-04 08:05:52.235', 'Laptop di beli WFH Accounting', 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0326-004');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (264, 'NBCNL-026', 1, 'PF5S97HM', '2026-03-31', NULL, 'Aktif', 6, 25, 222, '2026-09-04 08:05:53.138', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0326-005');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (265, 'NBCNL-027', 1, 'PF5Z5PLW', '2026-04-01', NULL, 'Aktif', 6, 23, 87, '2026-09-04 08:05:54.301', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0426-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (266, 'NBCNL-028', 1, 'PF63WQ83', '2026-05-12', NULL, 'Aktif', 6, 24, 127, '2026-09-04 08:05:55.328', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0526-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (267, 'NBCNL-029', 1, 'W1NXCV02U547024', '2026-05-24', NULL, 'Aktif', 6, 23, 237, '2026-09-04 08:05:56.621', NULL, 'Asus', 'Expertbook P1403CVA-S63850WS', 'NTB/CNL-0526-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (269, 'NBCNL-031', 1, 'PF60EEDR', '2026-06-08', NULL, 'Aktif', 6, 23, 96, '2026-09-04 08:05:58.973', NULL, 'Lenovo', 'IdeaPad Slim 3 15IRU8', 'NTB/CNL-0626-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (271, 'NBCNL-033', 1, 'PF608N3G', '2026-06-21', NULL, 'Aktif', 6, 24, 133, '2026-09-04 08:06:01.115', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0626-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (273, 'NBCNL-035', 1, 'PF5SAWH0', '2026-08-07', NULL, 'Aktif', 6, 24, 238, '2026-09-04 08:06:03.092', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0826-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (275, 'ExMuthiaSAISRG', 1, NULL, '2023-02-13', NULL, 'Hilang', 6, 24, 108, '2026-09-04 08:06:05.09', 'Laptop pembelian untu muthia semarang', 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/CNL-0223-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (268, 'NBCNL-030', 1, 'W1NXCV12J371043', '2026-05-29', NULL, 'Aktif', 6, 23, 134, '2026-09-04 08:05:57.808', NULL, 'Asus', 'Expertbook P1403CVA-S63850WS', 'NTB/CNL-0526-003');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (270, 'NBCNL-032', 1, 'PF60K94Y', '2026-06-08', NULL, 'Aktif', 6, 23, 216, '2026-09-04 08:06:00.201', 'Laptop pembelian awal untuk ruang meeting, kemudian di swap', 'Lenovo', 'IdeaPad Slim 3 15IRU8', 'NTB/CNL-0626-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (272, 'NBCNL-034', 1, 'W3NXCV06A499113', '2026-06-16', NULL, 'Aktif', 6, 24, 116, '2026-09-04 08:06:02.055', NULL, 'ASUS', 'EXPERTBOOK P1403CVA', 'NTB/CNL-0626-004');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (274, 'NBCNL-036', 1, 'PF63TKKG', '2026-08-31', NULL, 'Aktif', 6, 23, 102, '2026-09-04 08:06:03.883', NULL, 'Lenovo', 'IdeaPad Slim 3 14IRU8', 'NTB/CNL-0826-002');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (182, 'NB012', 1, 'PF4ABLAX', '2023-11-16', NULL, 'Hilang', 1, 1, 144, '2026-09-04 08:04:06.45', NULL, 'Lenovo', 'Ideapad 3 14ITL6', 'NTB/SLI-1123-013');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (228, 'NB060', 1, 'PF53J90B', '2025-03-20', NULL, 'Hilang', 1, 1, NULL, '2026-09-04 08:05:10.156', NULL, 'Lenovo', 'Ideapad 3 14IAH8', 'NTB/SLI-0325-001');
INSERT INTO public.devices (id, nama, type_id, serial_number, tgl_beli, harga_beli, status, company_id, branch_id, user_id, created_at, keterangan, merk, tipe, kode_inventaris) VALUES (276, 'ExAfiSAIJKT', 1, NULL, '2021-11-30', NULL, 'Rusak', 6, 23, 214, '2026-09-04 08:06:06.054', NULL, 'Infinix', 'Inbook X1', 'NTB/CNL-1121-001');


--
-- Data for Name: device_assignments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (223, 157, 80, '2023-12-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (225, 161, 53, '2023-12-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (226, 164, 57, '2023-12-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (227, 165, 61, '2023-12-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (228, 166, 228, '2026-05-18', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (229, 167, 177, '2023-07-27', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (230, 168, 227, '2024-05-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (231, 169, 58, '2026-05-25', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (232, 170, 67, '2024-05-21', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (233, 171, 146, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (234, 172, 191, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (235, 173, 111, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (237, 175, 209, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (238, 176, 166, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (239, 177, 194, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (240, 178, 193, '2026-06-30', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (241, 179, 180, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (242, 180, 173, '2025-10-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (243, 181, 71, '2024-11-21', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (244, 182, 144, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (245, 183, 203, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (246, 184, 154, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (247, 185, 224, '2026-03-30', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (248, 186, 221, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (249, 188, 208, '2025-05-14', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (250, 189, 198, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (251, 190, 142, '2025-11-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (252, 191, 150, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (253, 192, 190, '2025-09-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (254, 193, 197, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (255, 194, 151, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (256, 195, 204, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (257, 196, 210, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (258, 197, 158, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (259, 198, 78, '2024-08-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (260, 199, 196, '2026-08-31', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (261, 200, 153, '2025-09-04', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (262, 201, 172, '2026-04-13', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (263, 202, 175, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (264, 203, 219, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (265, 204, 212, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (266, 205, 162, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (267, 206, 207, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (268, 207, 68, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (269, 209, 156, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (270, 210, 139, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (271, 211, 171, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (272, 212, 164, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (273, 213, 192, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (274, 214, 174, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (275, 215, 169, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (276, 216, 56, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (277, 217, 55, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (278, 218, 230, '2026-08-19', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (279, 219, 72, '2024-12-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (280, 220, 73, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (281, 221, 66, '2023-11-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (282, 222, 59, '2024-01-23', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (283, 223, 181, '2024-04-27', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (284, 224, 187, '2024-06-10', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (285, 225, 70, '2024-07-10', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (286, 226, 160, '2024-08-21', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (287, 227, 86, '2025-03-05', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (288, 229, 186, '2025-12-22', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (289, 230, 199, '2026-08-20', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (290, 231, 137, '2026-04-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (291, 232, 201, '2026-05-12', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (292, 233, 226, '2026-05-12', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (293, 234, 66, '2026-05-13', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (294, 235, 206, '2026-06-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (295, 236, 184, '2026-06-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (296, 237, 69, '2026-08-19', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (297, 238, 220, '2026-05-20', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (298, 239, 236, '2026-01-12', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (299, 240, 125, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (300, 241, 89, '2024-11-05', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (301, 242, 82, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (302, 243, 104, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (303, 244, 81, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (304, 245, 115, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (305, 246, 110, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (306, 247, 118, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (307, 248, 119, '2024-01-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (308, 249, 88, '2024-08-27', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (309, 250, 97, '2024-10-09', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (310, 251, 129, '2024-10-17', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (311, 252, 115, '2025-01-13', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (312, 253, 103, '2026-06-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (313, 254, 112, '2025-11-17', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (314, 255, 109, '2026-06-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (315, 256, 113, '2025-02-04', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (316, 257, 128, '2026-04-20', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (317, 258, 83, '2026-02-07', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (318, 259, 95, '2026-03-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (319, 261, 94, '2026-03-03', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (320, 262, 93, '2026-02-12', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (321, 263, 91, '2026-03-30', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (322, 264, 222, '2026-03-31', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (323, 265, 87, '2026-04-01', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (324, 266, 127, '2026-05-12', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (325, 267, 237, '2026-05-24', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (326, 268, 134, '2026-05-29', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (327, 269, 96, '2026-06-08', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (328, 270, 216, '2026-06-08', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (329, 271, 133, '2026-06-21', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (330, 272, 116, '2026-06-16', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (331, 273, 238, '2026-08-07', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (332, 274, 102, '2026-08-31', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (335, 158, 231, '2021-08-09', '2024-07-10');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (336, 162, 73, '2022-02-09', '2023-12-01');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (337, 162, 83, '2023-12-01', '2024-06-12');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (338, 162, 58, '2024-06-12', '2026-03-03');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (339, 163, 66, '2022-07-12', '2023-12-01');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (340, 164, 56, '2022-12-09', '2022-12-09');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (341, 166, 174, '2023-06-03', '2024-05-29');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (342, 166, 225, '2024-05-29', '2025-05-20');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (343, 165, 192, '2023-02-13', '2023-12-01');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (344, 168, 188, '2020-07-15', '2023-12-01');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (345, 169, 83, '2024-06-12', '2026-02-07');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (346, 178, 202, '2023-11-16', '2026-06-30');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (347, 180, 159, '2023-11-16', '2024-09-10');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (348, 180, 144, '2024-12-30', '2025-10-03');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (349, 185, 218, '2023-11-16', '2026-03-17');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (350, 187, 74, '2023-11-16', '2026-07-31');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (351, 188, 63, '2023-11-16', '2024-11-01');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (352, 188, 65, '2024-11-01', '2025-05-14');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (353, 190, 163, '2023-11-16', '2025-11-03');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (354, 192, 182, '2023-11-16', '2025-09-30');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (355, 198, 102, '2023-11-16', '2024-08-16');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (356, 200, 188, '2023-11-16', '2025-09-04');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (357, 201, 195, '2023-11-16', '2025-05-06');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (358, 201, 155, '2025-05-06', '2025-09-22');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (359, 201, 211, '2025-09-22', '2026-04-13');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (360, 208, 75, '2023-11-16', '2026-08-12');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (361, 218, 231, '2023-11-16', '2026-08-19');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (362, 219, 76, '2023-11-16', '2024-12-16');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (363, 225, 229, '2024-07-10', '2025-12-01');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (364, 228, 138, '2025-03-20', '2025-11-10');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (365, 199, 69, '2023-11-16', '2026-08-27');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (366, 228, 196, '2025-11-10', '2026-07-14');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (367, 239, 126, '2024-01-29', '2025-07-07');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (368, 239, 130, '2025-07-07', '2026-01-12');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (369, 241, 92, '2024-01-29', '2024-11-05');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (370, 255, 114, '2025-03-07', NULL);
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (334, 276, 214, '2021-11-30', '2026-09-07');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (224, 158, 232, '2024-07-10', '2026-09-07');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (333, 275, 108, '2024-07-09', '2026-09-07');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (236, 174, 62, '2024-11-22', '2026-10-08');
INSERT INTO public.device_assignments (id, device_id, user_id, tgl_mulai, tgl_selesai) VALUES (371, 174, 77, '2026-10-08', NULL);


--
-- Data for Name: device_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: device_attributes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (426, 157, 'RAM', '4 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (427, 157, 'CPU', 'Intel Core i3-7020U');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (428, 157, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (438, 161, 'CPU', 'Core i3-1005G1');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (439, 161, 'RAM', '4 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (440, 161, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (441, 162, 'CPU', 'Core i3-1005G1 @1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (442, 162, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (443, 162, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (444, 163, 'CPU', 'Intel® Pentium ® Silver N5030 @1.10GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (445, 163, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (446, 163, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (447, 164, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (448, 164, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (449, 164, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (450, 165, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (451, 165, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (452, 165, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (453, 166, 'CPU', '12th Gen Intel® Core™ i5-1235U, 1300 MHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (454, 166, 'RAM', '16 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (455, 166, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (456, 166, 'Storage', '1 TB HDD Lama');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (457, 167, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (458, 167, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (459, 167, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (460, 168, 'CPU', 'Intel Core i3-8145U');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (461, 168, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (462, 168, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (463, 169, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (464, 169, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (465, 169, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (466, 170, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (467, 170, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (468, 170, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (469, 171, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (470, 171, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (471, 171, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (472, 172, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (473, 172, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (474, 172, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (475, 173, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (476, 173, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (477, 173, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (481, 175, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (482, 175, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (483, 175, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (484, 176, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (485, 176, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (486, 176, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (487, 177, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (488, 177, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (489, 177, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (490, 178, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (491, 178, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (492, 178, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (493, 179, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (494, 179, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (495, 179, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (496, 180, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (497, 180, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (498, 180, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (499, 181, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (500, 181, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (501, 181, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (505, 183, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (506, 183, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (507, 183, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (508, 184, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (509, 184, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (510, 184, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (511, 185, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (512, 185, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (513, 185, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (514, 186, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (515, 186, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (516, 186, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (517, 187, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (518, 187, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (519, 187, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (520, 188, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (521, 188, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (522, 188, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (523, 189, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (524, 189, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (525, 189, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (526, 190, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (527, 190, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (528, 190, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (529, 191, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (530, 191, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (531, 191, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (532, 192, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (533, 192, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (534, 192, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (535, 193, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (536, 193, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (537, 193, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (538, 194, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (539, 194, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (540, 194, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (541, 195, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (542, 195, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (543, 195, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (544, 196, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (545, 196, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (546, 196, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (547, 197, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (548, 197, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (549, 197, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (550, 198, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (551, 198, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (552, 198, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (553, 199, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (554, 199, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (555, 199, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (559, 201, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (560, 201, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (561, 201, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (565, 203, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (566, 203, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (567, 203, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (568, 204, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (569, 204, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (570, 204, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (574, 206, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (575, 206, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (576, 206, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (580, 208, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (581, 208, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (582, 208, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (586, 210, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (587, 210, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (588, 210, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (592, 212, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (593, 212, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (594, 212, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (598, 214, 'CPU', '12th Generation Intel® Core™ i5-1235U,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (599, 214, 'RAM', '16 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (600, 214, 'Storage', '512 GB SSD + 1TB Sata');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (604, 216, 'CPU', '12th Generation Intel® Core™ i5-1235U,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (605, 216, 'RAM', '16 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (556, 200, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (557, 200, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (558, 200, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (562, 202, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (563, 202, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (564, 202, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (571, 205, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (572, 205, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (573, 205, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (577, 207, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (578, 207, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (579, 207, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (583, 209, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (584, 209, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (585, 209, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (589, 211, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (590, 211, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (591, 211, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (595, 213, 'CPU', '12th Generation Intel® Core™ i5-1235U,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (596, 213, 'RAM', '16 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (597, 213, 'Storage', '512 GB SSD + 1TB Sata');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (601, 215, 'CPU', '12th Generation Intel® Core™ i5-1235U,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (602, 215, 'RAM', '16 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (603, 215, 'Storage', '512 GB SSD + 1TB Sata');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (606, 217, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (607, 217, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (608, 217, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (609, 218, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (610, 218, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (611, 218, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (612, 219, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (613, 219, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (614, 219, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (615, 220, 'CPU', '12th Generation Intel® Core™ i5-1235U,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (616, 220, 'RAM', '16 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (617, 220, 'Storage', '512 GB SSD + 1TB Sata');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (618, 221, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (619, 221, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (620, 221, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (621, 222, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s),');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (622, 222, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (623, 222, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (624, 223, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s),');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (625, 223, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (626, 223, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (627, 224, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s),');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (628, 224, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (629, 224, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (630, 225, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s),');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (631, 225, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (632, 225, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (633, 226, 'CPU', '13th Gen Intel(R) Core(TM) i5-13420H, 2100 Mhz, 8 Core(s), 12 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (634, 226, 'RAM', '16 gb');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (635, 226, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (636, 227, 'CPU', '12th Gen Intel(R) Core(TM) i5-12450H, 2000 Mhz, 8 Core(s), 12 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (637, 227, 'RAM', '16 gb');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (638, 227, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (642, 229, 'CPU', 'Intel Core i3-1315U');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (643, 229, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (644, 229, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (645, 230, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (646, 230, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (647, 230, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (648, 231, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (649, 231, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (650, 231, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (651, 232, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (652, 232, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (653, 232, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (654, 233, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U (1.20 GHz)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (655, 233, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (656, 233, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (657, 234, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U (1.20 GHz)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (658, 234, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (659, 234, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (660, 235, 'CPU', '13TH Gen Intel(R) Core(TM) i3-1315U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (661, 235, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (662, 235, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (663, 236, 'CPU', '13TH Gen Intel(R) Core(TM) i3-1315U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (664, 236, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (665, 236, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (666, 237, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U (1.20 GHz)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (667, 237, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (668, 237, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (669, 238, 'CPU', 'Intel Core i3-1315U Processor 1.2 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (670, 238, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (671, 238, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (672, 239, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (673, 239, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (674, 239, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (675, 240, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (676, 240, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (677, 240, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (678, 241, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (679, 241, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (680, 241, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (681, 242, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (682, 242, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (683, 242, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (684, 243, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (685, 243, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (686, 243, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (687, 244, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (688, 244, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (689, 244, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (690, 245, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (691, 245, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (692, 245, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (693, 246, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (694, 246, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (695, 246, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (699, 248, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (700, 248, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (701, 248, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (705, 250, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (706, 250, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (707, 250, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (711, 252, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (712, 252, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (713, 252, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (717, 254, 'CPU', '13TH Gen Intel(R) Core(TM) i3-1315U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (718, 254, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (719, 254, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (723, 256, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (724, 256, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (725, 256, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (729, 258, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (730, 258, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (731, 258, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (735, 260, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (736, 260, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (737, 260, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (741, 262, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (742, 262, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (743, 262, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (747, 264, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (748, 264, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (749, 264, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (753, 266, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (754, 266, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (755, 266, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (759, 268, 'CPU', 'Intel Core i3-1315U Processor 1.2 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (760, 268, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (761, 268, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (696, 247, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (697, 247, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (698, 247, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (702, 249, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (703, 249, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (704, 249, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (708, 251, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (709, 251, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (710, 251, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (714, 253, 'CPU', '12th Gen Intel(R) Core(TM) i3-1215U, 1200 Mhz, 6 Core(s), 8 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (715, 253, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (716, 253, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (720, 255, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (721, 255, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (722, 255, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (726, 257, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (727, 257, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (728, 257, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (732, 259, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (733, 259, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (734, 259, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (738, 261, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (739, 261, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (740, 261, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (744, 263, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (745, 263, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (746, 263, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (750, 265, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (751, 265, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (752, 265, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (756, 267, 'CPU', 'Intel Core i3-1315U Processor 1.2 GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (757, 267, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (758, 267, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (762, 269, 'CPU', 'Intel Core i3-1315U 1200 Mhz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (763, 269, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (764, 269, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (765, 270, 'CPU', 'Intel Core i3-1315U 1200 Mhz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (766, 270, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (767, 270, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (768, 271, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (769, 271, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (770, 271, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (771, 272, 'CPU', 'Intel(R) Core(TM) 3 I00U (1.20 GHz) Ram');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (772, 272, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (773, 272, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (774, 273, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (775, 273, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (776, 273, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (777, 274, 'CPU', '13th Gen Intel(R) Core(TM) i3-1315U   1.20 GHz,');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (778, 274, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (779, 274, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (786, 182, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (787, 182, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (788, 182, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (792, 228, 'RAM', '16 gb');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (793, 228, 'CPU', '12th Gen Intel(R) Core(TM) i5-12450H, 2000 Mhz, 8 Core(s), 12 Logical Processor(s)');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (794, 228, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (813, 159, 'RAM', '4 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (814, 159, 'CPU', 'AMD Athlon Silver 3050');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (815, 159, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (816, 160, 'RAM', '4 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (817, 160, 'CPU', 'AMD Athlon Silver 3050');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (818, 160, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (822, 158, 'RAM', '4 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (823, 158, 'CPU', 'Intel Core i3-1005G1');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (824, 158, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (825, 275, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (826, 275, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (827, 275, 'Storage', '512 GB SSD');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (828, 174, 'RAM', '8 GB');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (829, 174, 'CPU', '11th Gen Intel® Core™-i3 1115G4 @3.00GHz');
INSERT INTO public.device_attributes (id, device_id, key, value) VALUES (830, 174, 'Storage', '512 GB SSD');


--
-- Data for Name: device_placements; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (188, 157, 1, 3, '2026-09-04 08:03:27.284', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (189, 158, 1, 6, '2021-01-09 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (192, 161, 1, 5, '2023-12-01 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (193, 162, 1, 5, '2023-12-01 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (194, 163, 1, 4, '2023-12-01 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (195, 164, 1, 5, '2022-12-09 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (196, 165, 1, 5, '2023-12-01 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (197, 166, 2, 9, '2023-06-03 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (198, 167, 1, 1, '2023-07-27 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (199, 168, 1, 6, '2024-05-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (200, 169, 1, 5, '2026-05-25 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (201, 170, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (202, 171, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (203, 172, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (204, 173, 6, 24, '2026-01-07 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (205, 174, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (206, 175, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (207, 176, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (208, 177, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (209, 178, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (210, 179, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (211, 180, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (212, 181, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (213, 182, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (214, 183, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (215, 184, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (216, 185, 2, 12, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (217, 186, 2, 12, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (218, 187, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (219, 188, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (220, 189, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (221, 190, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (222, 191, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (223, 192, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (224, 193, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (225, 194, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (226, 195, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (227, 196, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (228, 197, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (229, 198, 1, 3, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (230, 199, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (231, 200, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (232, 201, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (233, 202, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (234, 203, 2, 9, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (235, 204, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (236, 205, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (237, 206, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (238, 207, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (239, 208, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (240, 209, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (241, 210, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (242, 211, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (243, 212, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (244, 213, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (245, 214, 2, 9, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (246, 215, 1, 1, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (247, 216, 1, 5, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (248, 217, 1, 5, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (249, 218, 1, 6, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (250, 219, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (251, 220, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (252, 221, 1, 7, '2023-11-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (253, 222, 1, 5, '2024-01-23 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (254, 223, 1, 1, '2024-04-27 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (255, 224, 1, 1, '2024-06-10 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (256, 225, 1, 7, '2024-07-10 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (257, 226, 1, 1, '2024-08-21 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (258, 227, 6, 23, '2025-03-05 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (259, 228, 1, 1, '2025-03-20 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (260, 229, 1, 1, '2025-12-22 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (261, 230, 1, 1, '2026-03-31 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (262, 231, 1, 1, '2026-04-01 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (263, 232, 1, 1, '2026-05-12 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (264, 233, 1, 6, '2026-05-12 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (265, 234, 1, 7, '2026-05-13 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (266, 235, 1, 1, '2026-06-03 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (267, 236, 1, 1, '2026-06-03 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (268, 237, 1, 7, '2026-08-19 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (269, 238, 2, 9, '2026-05-20 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (270, 239, 6, 23, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (271, 240, 6, 23, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (272, 241, 6, 25, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (273, 242, 6, 25, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (274, 243, 6, 25, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (275, 244, 6, 25, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (276, 245, 6, 24, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (277, 246, 6, 24, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (278, 247, 6, 26, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (279, 248, 6, 26, '2024-01-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (280, 249, 6, 25, '2024-08-27 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (281, 250, 6, 25, '2024-10-09 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (282, 251, 6, 23, '2024-10-17 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (283, 252, 6, 25, '2025-01-13 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (284, 253, 6, 23, '2025-03-07 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (285, 254, 6, 23, '2025-11-17 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (286, 255, 6, 24, '2025-02-04 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (287, 256, 6, 24, '2025-02-04 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (288, 257, 6, 23, '2025-02-09 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (289, 258, 6, 25, '2026-02-07 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (290, 259, 6, 25, '2026-03-03 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (291, 260, 6, 25, '2026-03-03 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (292, 261, 6, 25, '2026-03-03 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (293, 262, 6, 25, '2026-02-12 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (294, 263, 6, 23, '2026-03-30 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (295, 264, 6, 25, '2026-03-31 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (296, 265, 6, 23, '2026-04-01 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (297, 266, 6, 24, '2026-05-12 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (298, 267, 6, 23, '2026-05-24 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (299, 268, 6, 23, '2026-05-29 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (300, 269, 6, 23, '2026-06-08 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (301, 270, 6, 23, '2026-06-08 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (302, 271, 6, 24, '2026-06-21 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (303, 272, 6, 24, '2026-06-16 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (304, 273, 6, 24, '2026-08-07 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (305, 274, 6, 23, '2026-08-31 00:00:00', NULL);
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (308, 159, 1, 7, '2021-07-01 00:00:00', '2023-12-01 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (309, 160, 2, 12, '2021-07-10 00:00:00', '2023-12-01 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (310, 162, 1, 5, '2023-12-01 00:00:00', '2026-03-03 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (311, 163, 1, 7, '2022-07-12 00:00:00', '2023-12-01 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (312, 166, 2, 9, '2023-06-03 00:00:00', '2024-05-29 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (313, 168, 1, 1, '2019-09-06 00:00:00', '2024-05-29 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (314, 169, 2, 11, '2023-11-16 00:00:00', '2026-05-25 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (315, 173, 1, 1, '2023-11-16 00:00:00', '2024-05-01 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (316, 188, 1, 7, '2023-11-16 00:00:00', '2025-05-14 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (317, 198, 1, 1, '2023-11-16 00:00:00', '2024-08-16 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (318, 225, 1, 6, '2024-07-10 00:00:00', '2025-12-01 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (319, 227, 1, 1, '2025-03-05 00:00:00', '2025-06-05 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (320, 275, 2, 12, '2023-02-13 00:00:00', '2023-03-31 00:00:00');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (190, 159, 1, 6, '2023-12-01 00:00:00', '2026-09-07 08:14:55.95');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (321, 159, 1, 6, '2026-09-07 08:14:26.088', '2026-09-07 08:14:55.95');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (322, 159, 1, 6, '2026-09-07 08:15:34.404', '2026-09-07 08:15:49.048');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (307, 276, 6, 23, '2021-11-30 00:00:00', '2026-09-07 08:20:14.774');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (191, 160, 1, 6, '2023-12-01 00:00:00', '2026-09-07 08:40:03.303');
INSERT INTO public.device_placements (id, device_id, company_id, branch_id, tgl_mulai, tgl_selesai) VALUES (306, 275, 6, 24, '2023-03-31 00:00:00', '2026-09-07 10:05:49.357');


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tickets (id, device_id, user_id, branch_id, company_id, judul, prioritas, status, tgl_lapor, tgl_selesai, catatan_teknisi, diagnosa, divisi, kategori, kendala, no_tiket, solusi, teknisi_id, user_terkendala_id) VALUES (9, 171, NULL, 1, 1, 'error', 'Mengganggu pekerjaan', 'Selesai', '2026-09-08 08:36:00', '2026-09-08 08:37:26.937', NULL, NULL, 'Operational', 'Hardware', NULL, 'TKT-20260908-001', NULL, 152, 146);


--
-- Data for Name: ticket_attachments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 26, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 6, true);


--
-- Name: device_assignments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_assignments_id_seq', 371, true);


--
-- Name: device_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_attachments_id_seq', 6, true);


--
-- Name: device_attributes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_attributes_id_seq', 830, true);


--
-- Name: device_placements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_placements_id_seq', 322, true);


--
-- Name: device_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_types_id_seq', 7, true);


--
-- Name: devices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devices_id_seq', 276, true);


--
-- Name: ticket_attachments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ticket_attachments_id_seq', 3, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 9, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 240, true);


--
-- PostgreSQL database dump complete
--

\unrestrict mbVzziBdrr3CACKUH2fV2fBecmmyPG8LvEmlmKjhXbX2IGIwT5IXHdKuwLEqMVe

