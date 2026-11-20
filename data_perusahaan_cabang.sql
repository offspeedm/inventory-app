--
-- PostgreSQL database dump
--

\restrict znXxXx3QTR4mRdZMt8aG8HV0kR0fr2G3oereQUd83XykcQWxEAsq5PC0ft1U8Mf

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
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 26, true);


--
-- Name: companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.companies_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

\unrestrict znXxXx3QTR4mRdZMt8aG8HV0kR0fr2G3oereQUd83XykcQWxEAsq5PC0ft1U8Mf

