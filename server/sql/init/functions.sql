CREATE OR REPLACE FUNCTION session_delete_old_rows() RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  DELETE FROM session WHERE date_created < now() - INTERVAL '48 hours';
  RETURN NEW;
END;
$$;
