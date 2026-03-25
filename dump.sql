--
-- PostgreSQL database dump
--

\restrict 9LAsqToTVTkebDFO8LI8HxnymjpThhZazbenUvj3FQxIlP8Cg9N3hzMjBmvbhhF

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    user_id integer,
    date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    text text NOT NULL
);


ALTER TABLE public.posts OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO postgres;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: secret_access; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.secret_access (
    id integer NOT NULL,
    code text NOT NULL
);


ALTER TABLE public.secret_access OWNER TO postgres;

--
-- Name: secret_access_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.secret_access_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.secret_access_id_seq OWNER TO postgres;

--
-- Name: secret_access_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.secret_access_id_seq OWNED BY public.secret_access.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    firstname character varying(25) NOT NULL,
    lastname character varying(25) NOT NULL,
    email character varying(45) NOT NULL,
    password text NOT NULL,
    status boolean DEFAULT false,
    admin boolean DEFAULT false NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: secret_access id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secret_access ALTER COLUMN id SET DEFAULT nextval('public.secret_access_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.posts (id, user_id, date, text) FROM stdin;
7	9	2026-03-25 14:19:22.024956+01	Salut moi c'est Thibault
\.


--
-- Data for Name: secret_access; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.secret_access (id, code) FROM stdin;
5	$2b$10$bHTtazmorMlaqzmkf34j1ulu8nWLJGBVSJy5Z8wqR/pgjLqHXhqZm
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session (sid, sess, expire) FROM stdin;
ehB4aFMkNDZ6LPRMi-9cAtKbQ6L02NUL	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-25T16:10:56.372Z","httpOnly":true,"path":"/"},"passport":{"user":8}}	2026-03-26 08:43:23
T1SFpNqoY_LhiYB7QmA1RCXLvtlsjy7G	{"cookie":{"originalMaxAge":86400000,"expires":"2026-03-26T08:00:35.629Z","httpOnly":true,"path":"/"},"passport":{"user":9}}	2026-03-26 14:28:53
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, firstname, lastname, email, password, status, admin) FROM stdin;
8	Thomas	Potter	thomaslanzalavi@gmail.com	$2b$10$sMzAQsv5ifiH68nEoo2a6u6x6pY9OzLbt1fXFeJlzyvWw8FpqDdta	f	t
9	Thomas	Edison	contact@roninartisansdev.fr	$2b$10$xgTi3a8tAkovVIyBiWBsPOw2pzgipp8vj.aQuIt33rIPSBT4lQEGq	f	t
\.


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.posts_id_seq', 7, true);


--
-- Name: secret_access_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.secret_access_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: secret_access secret_access_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secret_access
    ADD CONSTRAINT secret_access_code_key UNIQUE (code);


--
-- Name: secret_access secret_access_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.secret_access
    ADD CONSTRAINT secret_access_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict 9LAsqToTVTkebDFO8LI8HxnymjpThhZazbenUvj3FQxIlP8Cg9N3hzMjBmvbhhF

