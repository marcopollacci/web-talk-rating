--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.0

-- Started on 2025-06-18 16:27:13 CEST

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
-- TOC entry 6 (class 2615 OID 24576)
-- Name: rating; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA rating;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 24577)
-- Name: events; Type: TABLE; Schema: rating; Owner: -
--

CREATE TABLE rating.events (
    id integer NOT NULL,
    name_event text NOT NULL,
    year integer,
    description text,
    random_value character varying(64) DEFAULT md5((random())::text),
    date_event_from date,
    date_event_to date,
    vote_enabled boolean DEFAULT false,
    talk text,
    url_image text,
    place text,
    is_live boolean DEFAULT true
);


--
-- TOC entry 220 (class 1259 OID 24585)
-- Name: rating; Type: TABLE; Schema: rating; Owner: -
--

CREATE TABLE rating.rating (
    id integer NOT NULL,
    value numeric(2,1),
    fk_events integer,
    comment text,
    date_rating timestamp with time zone DEFAULT (now() AT TIME ZONE 'utc'::text)
);


--
-- TOC entry 224 (class 1259 OID 90112)
-- Name: event_rating_backoffice; Type: VIEW; Schema: rating; Owner: -
--

CREATE VIEW rating.event_rating_backoffice AS
 SELECT ev.random_value AS id_event,
    ev.name_event,
    ev.date_event_from,
    ev.date_event_to,
    rat.value,
    rat.comment,
    rat.date_rating
   FROM (rating.rating rat
     LEFT JOIN rating.events ev ON ((rat.fk_events = ev.id)))
  ORDER BY rat.date_rating DESC;


--
-- TOC entry 219 (class 1259 OID 24584)
-- Name: events_id_seq; Type: SEQUENCE; Schema: rating; Owner: -
--

ALTER TABLE rating.events ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME rating.events_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 32772)
-- Name: events_rating; Type: VIEW; Schema: rating; Owner: -
--

CREATE VIEW rating.events_rating AS
 SELECT ev.random_value AS id_event,
    ev.name_event,
    ev.description,
    ev.year,
    ev.date_event_from,
    ev.date_event_to,
    rat.value
   FROM (rating.rating rat
     RIGHT JOIN rating.events ev ON ((rat.fk_events = ev.id)))
  WHERE (rat.value IS NOT NULL)
  ORDER BY ev.date_event_from DESC;


--
-- TOC entry 223 (class 1259 OID 73728)
-- Name: events_rating_avg; Type: VIEW; Schema: rating; Owner: -
--

CREATE VIEW rating.events_rating_avg AS
 SELECT ev.random_value AS id_event,
    ev.name_event,
    ev.description,
    ev.year,
    ev.date_event_from,
    ev.date_event_to,
    (COALESCE((avg(rat.value))::numeric(10,1), (0)::numeric))::double precision AS average,
    (count(rat.value))::integer AS number_of_rating
   FROM (rating.rating rat
     RIGHT JOIN rating.events ev ON ((rat.fk_events = ev.id)))
  GROUP BY ev.random_value, ev.name_event, ev.description, ev.year, ev.date_event_from, ev.date_event_to
  ORDER BY ev.date_event_from DESC;


--
-- TOC entry 221 (class 1259 OID 24594)
-- Name: rating_id_seq; Type: SEQUENCE; Schema: rating; Owner: -
--

ALTER TABLE rating.rating ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME rating.rating_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3209 (class 2606 OID 24596)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: rating; Owner: -
--

ALTER TABLE ONLY rating.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 24598)
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: rating; Owner: -
--

ALTER TABLE ONLY rating.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (id);


--
-- TOC entry 3212 (class 2606 OID 24599)
-- Name: rating fkevents; Type: FK CONSTRAINT; Schema: rating; Owner: -
--

ALTER TABLE ONLY rating.rating
    ADD CONSTRAINT fkevents FOREIGN KEY (fk_events) REFERENCES rating.events(id);


-- Completed on 2025-06-18 16:27:15 CEST

--
-- PostgreSQL database dump complete
--

