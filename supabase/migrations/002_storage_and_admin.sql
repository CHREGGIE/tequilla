-- Storage bucket for bottle images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tequila-images',
  'tequila-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public read for bottle images
CREATE POLICY "Public read tequila images bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'tequila-images');

-- Admin profiles table (optional manual promotion in Supabase Studio)
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read admin_users" ON admin_users
  FOR SELECT USING (auth.uid() = user_id);

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- Admin write policies for catalog tables
CREATE POLICY "Admins insert producers" ON producers
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update producers" ON producers
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete producers" ON producers
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins insert tequilas" ON tequilas
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update tequilas" ON tequilas
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete tequilas" ON tequilas
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins insert tequila_editions" ON tequila_editions
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update tequila_editions" ON tequila_editions
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete tequila_editions" ON tequila_editions
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins insert tequila_images" ON tequila_images
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update tequila_images" ON tequila_images
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete tequila_images" ON tequila_images
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins insert recipes" ON recipes
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update recipes" ON recipes
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete recipes" ON recipes
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins insert recipe_tequilas" ON recipe_tequilas
  FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins update recipe_tequilas" ON recipe_tequilas
  FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete recipe_tequilas" ON recipe_tequilas
  FOR DELETE USING (public.is_admin());

CREATE POLICY "Admins upload tequila images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'tequila-images' AND public.is_admin());

CREATE POLICY "Admins update tequila images storage" ON storage.objects
  FOR UPDATE USING (bucket_id = 'tequila-images' AND public.is_admin());

CREATE POLICY "Admins delete tequila images storage" ON storage.objects
  FOR DELETE USING (bucket_id = 'tequila-images' AND public.is_admin());
