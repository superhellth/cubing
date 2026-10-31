-- Up Migration
CREATE TABLE solves (
    pk            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id            bigint GENERATED ALWAYS AS IDENTITY,
    uuid          uuid NOT NULL,
    date          timestamptz NOT NULL,
    duration      double precision NOT NULL,
    scramble      text NOT NULL,
    discipline    text NOT NULL,
    status        text NOT NULL CHECK (status IN ('Valid', '+2', 'DNF')),
    session       text NOT NULL,
    import_source text,
    import_key    bigint
);

CREATE INDEX solves_uuid_date_idx ON solves (uuid, date);

CREATE FUNCTION enforce_solve_limit() RETURNS trigger AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM solves
        WHERE uuid IN (SELECT DISTINCT uuid FROM new_rows)
        GROUP BY uuid HAVING count(*) > 100000
    ) THEN
        RAISE EXCEPTION 'User limit reached' USING ERRCODE = 'unique_violation';
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER solves_limit
    AFTER INSERT ON solves
    REFERENCING NEW TABLE AS new_rows
    FOR EACH STATEMENT EXECUTE FUNCTION enforce_solve_limit();

-- Down Migration
DROP TRIGGER solves_limit ON solves;
DROP FUNCTION enforce_solve_limit();
DROP TABLE solves;