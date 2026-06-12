-- Aggregation view for session-track metrics
-- Note: compatible with Postgres

CREATE OR REPLACE VIEW mv_session_track_agg AS
SELECT
    s.id AS session_id,
    p.id AS participant_id,
    p."anonToken" AS participant_anon_token,
    s."stimulusSetId",
    s."entryTs",
    s."exitTs",
    s.completed,
    s."totalSeconds",
    pl."trackId",
    COUNT(pl.id) AS play_count,
    SUM(
        CASE
            WHEN pl."playedFull" THEN 1
            ELSE 0
        END
    ) AS played_full_count,
    AVG(r."responseTimeMs") AS average_response_ms
FROM
    "Session" s
    LEFT JOIN "Participant" p ON p.id = s."participantId"
    LEFT JOIN "Play" pl ON pl."sessionId" = s.id
    LEFT JOIN "Response" r ON r."sessionId" = s.id
GROUP BY
    s.id,
    p.id,
    p."anonToken",
    s."stimulusSetId",
    s."entryTs",
    s."exitTs",
    s.completed,
    s."totalSeconds",
    pl."trackId";

-- Optional index suggestions (cannot be created in view; add on base tables)
-- CREATE INDEX IF NOT EXISTS idx_play_session_track ON "Play"("sessionId", "trackId");
-- CREATE INDEX IF NOT EXISTS idx_response_session_track ON "Response"("sessionId");
