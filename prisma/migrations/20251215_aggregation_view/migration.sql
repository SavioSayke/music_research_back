-- Aggregation view for session-track metrics
-- Note: compatible with Postgres

CREATE OR REPLACE VIEW mv_session_track_agg AS
SELECT
    s.id AS session_id,
    p.id AS participant_id,
    p.anon_token AS participant_anon_token,
    s.stimulus_set_id,
    s.entry_ts,
    s.exit_ts,
    s.completed,
    s.total_seconds,
    pl.track_id,
    COUNT(pl.id) AS play_count,
    SUM(
        CASE
            WHEN pl.played_full THEN 1
            ELSE 0
        END
    ) AS played_full_count,
    AVG(r.response_ms) AS average_response_ms
FROM
    session s
    LEFT JOIN participant p ON p.id = s.participant_id
    LEFT JOIN play pl ON pl.session_id = s.id
    LEFT JOIN response r ON r.session_id = s.id
    AND r.track_id = pl.track_id
GROUP BY
    s.id,
    p.id,
    p.anon_token,
    s.stimulus_set_id,
    s.entry_ts,
    s.exit_ts,
    s.completed,
    s.total_seconds,
    pl.track_id;

-- Optional index suggestions (cannot be created in view; add on base tables)
-- CREATE INDEX IF NOT EXISTS idx_play_session_track ON play(session_id, track_id);
-- CREATE INDEX IF NOT EXISTS idx_response_session_track ON response(session_id, track_id);