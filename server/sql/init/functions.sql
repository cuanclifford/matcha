CREATE OR REPLACE FUNCTION GeographicDistance(a POINT, b POINT)
RETURNS FLOAT
LANGUAGE SQL
AS $$
  SELECT * FROM earth_distance(ll_to_earth(a[0], a[1]), ll_to_earth(b[0], b[1]));
$$;

CREATE OR REPLACE FUNCTION UserDistance(a INT, b INT)
RETURNS FLOAT
LANGUAGE plpgsql
AS $$
DECLARE
	locationA POINT := (SELECT location FROM user_location WHERE user_id = a);
	locationB POINT := (SELECT location FROM user_location WHERE user_id = b);
BEGIN
  RETURN (SELECT GeographicDistance(locationA, locationB));
END $$;