DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'session_delete_old_rows_trigger')
  THEN
    CREATE TRIGGER session_delete_old_rows_trigger
      AFTER INSERT ON session
      EXECUTE PROCEDURE session_delete_old_rows();
  END IF;
END;
$$;