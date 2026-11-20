--
-- PostgreSQL database dump
--

\restrict QMadD8VX5N8ZXEWcJXfOQgtMDic5Ve5i8NbRxTQNr102khhkFgghg5eoilLTuf5

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
-- Name: device_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.device_types_id_seq', 7, true);


--
-- PostgreSQL database dump complete
--

\unrestrict QMadD8VX5N8ZXEWcJXfOQgtMDic5Ve5i8NbRxTQNr102khhkFgghg5eoilLTuf5

