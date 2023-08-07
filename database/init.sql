--
-- PostgreSQL database dump
--

-- Dumped from database version 13.11 (Debian 13.11-1.pgdg120+1)
-- Dumped by pg_dump version 13.11 (Debian 13.11-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: ChannelMemberRole; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."ChannelMemberRole" AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public."ChannelMemberRole" OWNER TO myuser;

--
-- Name: ChannelTypes; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."ChannelTypes" AS ENUM (
    'PUBLIC',
    'PROTECTED',
    'PRIVATE'
);


ALTER TYPE public."ChannelTypes" OWNER TO myuser;

--
-- Name: ChannelUserRestrictionTypes; Type: TYPE; Schema: public; Owner: myuser
--

CREATE TYPE public."ChannelUserRestrictionTypes" AS ENUM (
    'MUTED',
    'BANNED'
);


ALTER TYPE public."ChannelUserRestrictionTypes" OWNER TO myuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Blocked; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Blocked" (
    "blockedUserId" integer NOT NULL,
    "blockingUserId" integer NOT NULL
);


ALTER TABLE public."Blocked" OWNER TO myuser;

--
-- Name: Channel; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Channel" (
    id integer NOT NULL,
    "creatorId" integer NOT NULL,
    title text NOT NULL,
    password text,
    "channelType" public."ChannelTypes" DEFAULT 'PUBLIC'::public."ChannelTypes" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Channel" OWNER TO myuser;

--
-- Name: ChannelMember; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."ChannelMember" (
    "userId" integer NOT NULL,
    "channelId" integer NOT NULL,
    role public."ChannelMemberRole" DEFAULT 'USER'::public."ChannelMemberRole" NOT NULL
);


ALTER TABLE public."ChannelMember" OWNER TO myuser;

--
-- Name: ChannelUserRestriction; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."ChannelUserRestriction" (
    "restrictedUserId" integer NOT NULL,
    "restrictedChannelId" integer NOT NULL,
    "restrictionType" public."ChannelUserRestrictionTypes" NOT NULL
);


ALTER TABLE public."ChannelUserRestriction" OWNER TO myuser;

--
-- Name: Channel_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public."Channel_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Channel_id_seq" OWNER TO myuser;

--
-- Name: Channel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public."Channel_id_seq" OWNED BY public."Channel".id;


--
-- Name: FriendRequest; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."FriendRequest" (
    "senderId" integer NOT NULL,
    "receiverId" integer NOT NULL,
    "isAccepted" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."FriendRequest" OWNER TO myuser;

--
-- Name: Match; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    started timestamp(3) without time zone NOT NULL,
    ended timestamp(3) without time zone NOT NULL,
    "homePlayerId" integer NOT NULL,
    "awayPlayerId" integer NOT NULL,
    "winnerId" integer NOT NULL,
    "homeScore" integer NOT NULL,
    "awayScore" integer NOT NULL
);


ALTER TABLE public."Match" OWNER TO myuser;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Match_id_seq" OWNER TO myuser;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: Message; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."Message" (
    id integer NOT NULL,
    "senderId" integer NOT NULL,
    "receiverId" integer,
    "channelId" integer,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Message" OWNER TO myuser;

--
-- Name: Message_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public."Message_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Message_id_seq" OWNER TO myuser;

--
-- Name: Message_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public."Message_id_seq" OWNED BY public."Message".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    "userName" text DEFAULT ''::text,
    "OAuthName" text NOT NULL,
    email text DEFAULT ''::text,
    avatar text DEFAULT 'https://avatarfiles.alphacoders.com/183/183501.jpg'::text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "accessToken" text DEFAULT 'None'::text NOT NULL,
    "is2Fa" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."User" OWNER TO myuser;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: myuser
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO myuser;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: myuser
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: myuser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO myuser;

--
-- Name: Channel id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Channel" ALTER COLUMN id SET DEFAULT nextval('public."Channel_id_seq"'::regclass);


--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Name: Message id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Message" ALTER COLUMN id SET DEFAULT nextval('public."Message_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Blocked; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Blocked" ("blockedUserId", "blockingUserId") FROM stdin;
7	8
6	4
4	7
\.


--
-- Data for Name: Channel; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Channel" (id, "creatorId", title, password, "channelType", "createdAt") FROM stdin;
1	5	Old Gods Gang	G0ds	PROTECTED	2023-08-07 11:01:43.214
2	8	Icons	\N	PRIVATE	2023-08-07 11:01:43.214
3	4	Memes	\N	PUBLIC	2023-08-07 11:01:43.214
\.


--
-- Data for Name: ChannelMember; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."ChannelMember" ("userId", "channelId", role) FROM stdin;
5	1	ADMIN
6	1	USER
3	1	USER
7	2	USER
8	2	ADMIN
10	2	USER
9	2	USER
1	3	USER
2	3	USER
7	3	USER
10	3	USER
7	1	USER
4	3	ADMIN
3	3	ADMIN
\.


--
-- Data for Name: ChannelUserRestriction; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."ChannelUserRestriction" ("restrictedUserId", "restrictedChannelId", "restrictionType") FROM stdin;
6	1	MUTED
1	3	BANNED
\.


--
-- Data for Name: FriendRequest; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."FriendRequest" ("senderId", "receiverId", "isAccepted") FROM stdin;
2	8	f
6	8	t
7	9	t
3	4	t
5	10	t
3	6	f
1	8	t
3	7	f
\.


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Match" (id, started, ended, "homePlayerId", "awayPlayerId", "winnerId", "homeScore", "awayScore") FROM stdin;
1	1970-01-01 00:00:00	1970-01-01 00:00:00	4	7	7	15	16
2	1970-01-01 00:00:00	1970-01-01 00:00:00	8	3	3	0	9
3	1970-01-01 00:00:00	1970-01-01 00:00:00	4	9	9	3	5
4	1970-01-01 00:00:00	1970-01-01 00:00:00	10	5	10	17	2
5	1970-01-01 00:00:00	1970-01-01 00:00:00	9	8	8	1	12
6	1970-01-01 00:00:00	1970-01-01 00:00:00	3	1	3	11	2
7	1970-01-01 00:00:00	1970-01-01 00:00:00	9	2	9	14	5
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."Message" (id, "senderId", "receiverId", "channelId", content, "createdAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public."User" (id, "userName", "OAuthName", email, avatar, "createdAt", "accessToken", "is2Fa") FROM stdin;
1	John	sdfjalk	john@john.com	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
2	Arthur	sfsh	arthur@morgan.org	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
3	Morgana	hgflkj	morgana@persone.com	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
4	Gladys	dghhg	gladys@wonder.com	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
5	Zardos	gjfjfjfz	zardos@aol.com	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
6	Helena	drhdthth	helena@olymp.com	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
7	Xena	fjtdrtdjzf	xena@scream.org	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
8	Anakin	thddthtj	anakin@lucasarts.com	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
9	RubberDuck	fghzjfjnfg	rubrub@rub.ru	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
10	Asterix	tjfjdhdh	asterix@google.gae	https://avatarfiles.alphacoders.com/183/183501.jpg	2023-08-07 10:56:57.683	None	f
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: myuser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d3d612f1-659e-4ba0-8ea0-2c8d5d364114	639992b3c37f9c3dfde93ee1d56ed92d9237827d0dfc8bdf12261476ad1f3423	2023-08-07 10:50:47.042459+00	20230805104227_update	\N	\N	2023-08-07 10:50:47.006761+00	1
\.


--
-- Name: Channel_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public."Channel_id_seq"', 3, true);


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public."Match_id_seq"', 7, true);


--
-- Name: Message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public."Message_id_seq"', 1, false);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: myuser
--

SELECT pg_catalog.setval('public."User_id_seq"', 10, true);


--
-- Name: Channel Channel_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_pkey" PRIMARY KEY (id);


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Blocked_blockingUserId_blockedUserId_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "Blocked_blockingUserId_blockedUserId_key" ON public."Blocked" USING btree ("blockingUserId", "blockedUserId");


--
-- Name: ChannelMember_userId_channelId_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "ChannelMember_userId_channelId_key" ON public."ChannelMember" USING btree ("userId", "channelId");


--
-- Name: ChannelUserRestriction_restrictedUserId_restrictedChannelId_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "ChannelUserRestriction_restrictedUserId_restrictedChannelId_key" ON public."ChannelUserRestriction" USING btree ("restrictedUserId", "restrictedChannelId");


--
-- Name: Channel_title_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "Channel_title_key" ON public."Channel" USING btree (title);


--
-- Name: FriendRequest_senderId_receiverId_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "FriendRequest_senderId_receiverId_key" ON public."FriendRequest" USING btree ("senderId", "receiverId");


--
-- Name: User_OAuthName_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "User_OAuthName_key" ON public."User" USING btree ("OAuthName");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_userName_key; Type: INDEX; Schema: public; Owner: myuser
--

CREATE UNIQUE INDEX "User_userName_key" ON public."User" USING btree ("userName");


--
-- Name: Blocked Blocked_blockedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT "Blocked_blockedUserId_fkey" FOREIGN KEY ("blockedUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Blocked Blocked_blockingUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Blocked"
    ADD CONSTRAINT "Blocked_blockingUserId_fkey" FOREIGN KEY ("blockingUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChannelMember ChannelMember_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."ChannelMember"
    ADD CONSTRAINT "ChannelMember_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChannelMember ChannelMember_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."ChannelMember"
    ADD CONSTRAINT "ChannelMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChannelUserRestriction ChannelUserRestriction_restrictedChannelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."ChannelUserRestriction"
    ADD CONSTRAINT "ChannelUserRestriction_restrictedChannelId_fkey" FOREIGN KEY ("restrictedChannelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ChannelUserRestriction ChannelUserRestriction_restrictedUserId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."ChannelUserRestriction"
    ADD CONSTRAINT "ChannelUserRestriction_restrictedUserId_fkey" FOREIGN KEY ("restrictedUserId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Channel Channel_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Channel"
    ADD CONSTRAINT "Channel_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: FriendRequest FriendRequest_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."FriendRequest"
    ADD CONSTRAINT "FriendRequest_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_awayPlayerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_awayPlayerId_fkey" FOREIGN KEY ("awayPlayerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_homePlayerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_homePlayerId_fkey" FOREIGN KEY ("homePlayerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Match Match_winnerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_channelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES public."Channel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_receiverId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Message Message_senderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: myuser
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

