-- SQL Script to create the visited_clients table
-- Copy and paste this entirely into your Supabase SQL Editor and click "Run"

CREATE TABLE IF NOT EXISTS public.visited_clients (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    visit_date date,
    name text NOT NULL,
    phone text NOT NULL,
    project text,
    properties jsonb,
    budget text,
    notes text,
    CONSTRAINT visited_clients_pkey PRIMARY KEY (id)
);

-- Turn on Row Level Security (RLS) but allow anonymous access since the app relies on the anon key
ALTER TABLE public.visited_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read access to visited_clients"
ON public.visited_clients FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert access to visited_clients"
ON public.visited_clients FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update access to visited_clients"
ON public.visited_clients FOR UPDATE TO anon USING (true);

CREATE POLICY "Allow anonymous delete access to visited_clients"
ON public.visited_clients FOR DELETE TO anon USING (true);
